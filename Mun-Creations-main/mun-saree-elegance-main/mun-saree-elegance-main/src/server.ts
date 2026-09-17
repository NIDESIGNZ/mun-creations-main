import { backendDB } from "./lib/backend-api";
import { razorpayService } from "./services/razorpayService";
import { exchangeRateServerService } from "./services/exchangeRateServerService";
import { ensureEnvLoaded } from "./lib/envLoader";
import { productDatabase } from "./lib/server/productDatabase";
import { contentDatabase } from "./lib/server/contentDatabase";
import fs from "fs";
import pathModule from "path";

// API router for backend REST endpoints
async function handleApiRequests(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;

  // Static redirect fallback for legacy /src/assets/* requests
  if (path.startsWith("/src/assets/")) {
    const filename = pathModule.basename(path);
    return Response.redirect(new URL(`/images/products/${filename}`, request.url), 301);
  }

  if (!path.startsWith("/api/")) return null;

  ensureEnvLoaded();

  const headers = {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "Content-Type, Authorization",
    "cache-control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
    "pragma": "no-cache",
    "expires": "0",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    if (path === "/api/health") {
      const dbStatus = backendDB.getHealthStatus();
      const effectiveKeyId = (
        process.env.RAZORPAY_KEY_ID ||
        process.env.VITE_RAZORPAY_KEY_ID ||
        "rzp_test_TUvDNWVSudCBUS"
      ).trim();
      const hasKeyId = Boolean(effectiveKeyId);
      const effectiveKeySecret = (
        process.env.RAZORPAY_KEY_SECRET ||
        "jay8vfhMtRnjcpGFlpzvI9TZ"
      ).trim();
      const hasKeySecret = Boolean(effectiveKeySecret);
      return new Response(
        JSON.stringify({
          service: "Mun Creations API",
          ...dbStatus,
          status: "ok",
          razorpay_key_id_present: hasKeyId,
          razorpay_key_secret_present: hasKeySecret,
          timestamp: new Date().toISOString(),
        }),
        { headers },
      );
    }

    if (path === "/api/create-order" || path === "/api/payments/razorpay/create-order") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
          status: 405,
          headers,
        });
      }

      const body = await request.json();
      const {
        items,
        promoCode,
        shippingMethod,
        shippingCostInr,
        shippingProvider,
        currency = "INR",
        receipt,
        notes,
        amount,
      } = body || {};

      try {
        const order = await razorpayService.createOrder({
          items,
          promoCode,
          shippingMethod,
          shippingCostInr,
          shippingProvider,
          currency,
          receipt,
          notes,
          amount,
        });

        return new Response(
          JSON.stringify({
            order_id: order.order_id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            key_id: (
              process.env.RAZORPAY_KEY_ID ||
              process.env.VITE_RAZORPAY_KEY_ID ||
              "rzp_test_TUvDNWVSudCBUS"
            ).trim(),
            calculation: order.calculation,
          }),
          { status: 200, headers },
        );
      } catch (err: any) {
        const statusCode = err?.status || (err?.statusCode === 401 ? 401 : 500);
        return new Response(
          JSON.stringify({
            success: false,
            error: err?.message || "Failed to create Razorpay order",
          }),
          { status: statusCode, headers },
        );
      }
    }

    if (path === "/api/verify-payment" || path === "/api/payments/razorpay/verify") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
          status: 405,
          headers,
        });
      }

      const body = await request.json();
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } =
        body || {};

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return new Response(
          JSON.stringify({
            success: false,
            error:
              "Missing required fields: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.",
          }),
          { status: 400, headers },
        );
      }

      const verification = razorpayService.verifyPaymentSignature({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      if (!verification.isValid) {
        return new Response(
          JSON.stringify({
            success: false,
            error:
              verification.error ||
              "Payment signature verification failed. Transaction cannot be confirmed.",
          }),
          { status: 400, headers },
        );
      }

      // Idempotency: If order with this payment ID already exists in DB, return it without duplicate stock deduction
      let confirmedOrder = backendDB.getOrderByPaymentId(razorpay_payment_id);
      if (!confirmedOrder && orderDetails) {
        confirmedOrder = backendDB.createOrder({
          ...orderDetails,
          paymentMethod: "razorpay",
          paymentId: razorpay_payment_id,
          status: "Confirmed",
        });
      } else if (
        confirmedOrder &&
        confirmedOrder.status !== "Paid" &&
        confirmedOrder.status !== "Confirmed"
      ) {
        confirmedOrder = backendDB.updateOrderStatus(confirmedOrder.id, "Confirmed");
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Payment signature verified successfully.",
          razorpay_order_id,
          razorpay_payment_id,
          order: confirmedOrder,
        }),
        { status: 200, headers },
      );
    }

    if (path === "/api/webhooks/razorpay" || path === "/api/payments/razorpay/webhook") {
      if (request.method === "GET") {
        return new Response(
          JSON.stringify({
            status: "ok",
            message:
              "Razorpay Webhook endpoint is active. POST requests with x-razorpay-signature header are required.",
          }),
          { status: 200, headers },
        );
      }

      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
          status: 405,
          headers,
        });
      }

      const rawBody = await request.text();
      const signature = request.headers.get("x-razorpay-signature") || "";

      // Signature verification
      const verification = razorpayService.verifyWebhookSignature(rawBody, signature);
      if (!verification.isValid) {
        return new Response(
          JSON.stringify({
            success: false,
            error: verification.error || "Invalid webhook signature.",
          }),
          { status: 400, headers },
        );
      }

      try {
        const event = JSON.parse(rawBody);
        const eventId = event?.id || `${event?.event}_${event?.created_at}`;

        // Idempotency check: Ignore duplicate webhook deliveries
        if (razorpayService.isEventProcessed(eventId)) {
          return new Response(JSON.stringify({ status: "already_processed", eventId }), {
            status: 200,
            headers,
          });
        }

        const eventType = event?.event;
        const payload = event?.payload;

        if (eventType === "payment.captured" || eventType === "order.paid") {
          const paymentEntity = payload?.payment?.entity;
          const paymentId = paymentEntity?.id;
          const orderId = paymentEntity?.order_id || payload?.order?.entity?.id;

          if (paymentId) {
            const existingOrder = backendDB.getOrderByPaymentId(paymentId);
            if (existingOrder) {
              backendDB.updateOrderStatus(existingOrder.id, "Paid");
            }
          }
        } else if (eventType === "payment.failed") {
          const paymentEntity = payload?.payment?.entity;
          const paymentId = paymentEntity?.id;
          if (paymentId) {
            const existingOrder = backendDB.getOrderByPaymentId(paymentId);
            if (existingOrder) {
              backendDB.updateOrderStatus(existingOrder.id, "Failed");
            }
          }
        } else if (eventType === "refund.processed" || eventType === "refund.created") {
          const refundEntity = payload?.refund?.entity;
          const paymentId = refundEntity?.payment_id;
          if (paymentId) {
            const existingOrder = backendDB.getOrderByPaymentId(paymentId);
            if (existingOrder) {
              backendDB.updateOrderStatus(existingOrder.id, "Refunded");
            }
          }
        }

        razorpayService.markEventProcessed(eventId);

        return new Response(JSON.stringify({ status: "ok", receivedEvent: eventType }), {
          status: 200,
          headers,
        });
      } catch (err: any) {
        return new Response(
          JSON.stringify({ success: false, error: "Failed to process webhook event." }),
          {
            status: 500,
            headers,
          },
        );
      }
    }

    if (path === "/api/refund-order") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
          status: 405,
          headers,
        });
      }

      const body = await request.json();
      const { paymentId, amount, reason, orderId } = body || {};

      if (!paymentId) {
        return new Response(
          JSON.stringify({ success: false, error: "Payment ID is required to issue a refund." }),
          { status: 400, headers },
        );
      }

      try {
        const refund = await razorpayService.refundPayment(
          paymentId,
          amount ? Math.round(amount) : undefined,
          {
            reason: reason || "Customer request / return",
          },
        );

        if (orderId) {
          backendDB.updateOrderStatus(orderId, "Refunded");
        } else {
          const order = backendDB.getOrderByPaymentId(paymentId);
          if (order) {
            backendDB.updateOrderStatus(order.id, "Refunded");
          }
        }

        return new Response(
          JSON.stringify({ success: true, message: "Refund initiated successfully.", refund }),
          { status: 200, headers },
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ success: false, error: err?.message || "Failed to process refund." }),
          { status: err?.status || 500, headers },
        );
      }
    }

    // --- PUBLIC SITE CONTENT (CMS) API ---
    if (path === "/api/content" && request.method === "GET") {
      const content = contentDatabase.getContent();
      return new Response(JSON.stringify({ success: true, content }), { status: 200, headers });
    }

    if (path.startsWith("/api/content/") && request.method === "GET") {
      const section = path.replace("/api/content/", "").trim() as any;
      const data = contentDatabase.getSection(section);
      return new Response(JSON.stringify({ success: true, section, data }), { status: 200, headers });
    }

    // --- ADMIN AUTHENTICATION & SESSION API ---
    if (path === "/api/admin/auth/login") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), { status: 405, headers });
      }
      const body = await request.json().catch(() => ({}));
      const { password } = body;
      const result = productDatabase.verifyAdminCredentials(password || "");
      if (result.success) {
        return new Response(JSON.stringify({ success: true, token: result.token, message: "Authentication successful." }), {
          status: 200,
          headers,
        });
      }
      return new Response(JSON.stringify({ success: false, error: result.error || "Authentication failed." }), {
        status: 401,
        headers,
      });
    }

    if (path === "/api/admin/auth/verify") {
      const authHeader = request.headers.get("authorization");
      const isAuthed = productDatabase.validateSessionToken(authHeader);
      return new Response(JSON.stringify({ success: isAuthed, authenticated: isAuthed }), {
        status: isAuthed ? 200 : 401,
        headers,
      });
    }

    if (path === "/api/admin/auth/logout") {
      const authHeader = request.headers.get("authorization") || "";
      productDatabase.logoutSession(authHeader);
      return new Response(JSON.stringify({ success: true, message: "Logged out successfully." }), { status: 200, headers });
    }

    // --- ADMIN AUTHORIZATION MIDDLEWARE GUARD ---
    if (path.startsWith("/api/admin/")) {
      const authHeader = request.headers.get("authorization");
      const isAuthed = productDatabase.validateSessionToken(authHeader);
      if (!isAuthed) {
        return new Response(
          JSON.stringify({ success: false, error: "Unauthorized: Administrator access token is required or expired." }),
          { status: 401, headers },
        );
      }
    }

    // --- ADMIN CONTENT (CMS) API ---
    if (path === "/api/admin/content/reset" && request.method === "POST") {
      const content = contentDatabase.resetToDefault("admin");
      productDatabase.logAudit("CMS_RESET", "auth", "Reset all site content to defaults", undefined, "admin");
      return new Response(JSON.stringify({ success: true, content, message: "Site content reset to specification defaults." }), { status: 200, headers });
    }

    if (path.startsWith("/api/admin/content/")) {
      const section = decodeURIComponent(path.replace("/api/admin/content/", "")).trim() as any;
      if (request.method === "GET") {
        const data = contentDatabase.getSection(section);
        return new Response(JSON.stringify({ success: true, section, data }), { status: 200, headers });
      }
      if (request.method === "PUT" || request.method === "PATCH" || request.method === "POST") {
        const body = await request.json().catch(() => ({}));
        const updated = contentDatabase.updateSection(section, body, "admin");
        productDatabase.logAudit("CMS_UPDATE", "auth", `Updated CMS section "${section}"`, undefined, "admin");
        return new Response(JSON.stringify({ success: true, section, data: updated }), { status: 200, headers });
      }
    }

    if (path === "/api/admin/content" && request.method === "GET") {
      const content = contentDatabase.getContent();
      return new Response(JSON.stringify({ success: true, content }), { status: 200, headers });
    }

    // --- ADMIN PRODUCTS API ---
    if (path === "/api/admin/products/export") {
      const csv = productDatabase.exportProductsToCSV();
      return new Response(csv, {
        status: 200,
        headers: {
          ...headers,
          "content-type": "text/csv; charset=utf-8",
          "content-disposition": `attachment; filename="mun_creations_catalog_${Date.now()}.csv"`,
        },
      });
    }

    if (path === "/api/admin/products/bulk-import") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), { status: 405, headers });
      }
      const body = await request.json().catch(() => ({}));
      const { csvContent } = body;
      if (!csvContent || typeof csvContent !== "string") {
        return new Response(JSON.stringify({ success: false, error: "csvContent string is required." }), { status: 400, headers });
      }
      const importRes = productDatabase.bulkImportCSV(csvContent);
      return new Response(JSON.stringify({ success: true, ...importRes }), { status: 200, headers });
    }

    if (path === "/api/admin/products/bulk-update") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), { status: 405, headers });
      }
      const body = await request.json().catch(() => ({}));
      const { productIds, updates } = body;
      if (!Array.isArray(productIds) || productIds.length === 0 || !updates) {
        return new Response(JSON.stringify({ success: false, error: "productIds array and updates object are required." }), { status: 400, headers });
      }
      const bulkRes = productDatabase.bulkUpdate(productIds, updates);
      return new Response(JSON.stringify({ success: true, ...bulkRes }), { status: 200, headers });
    }

    if (path.startsWith("/api/admin/products/")) {
      const rest = path.replace("/api/admin/products/", "");
      const segments = rest.split("/");
      const id = decodeURIComponent(segments[0]);
      const action = segments[1];

      if (action === "publish" && request.method === "POST") {
        const updated = productDatabase.updateProduct(id, { published: true, active: true });
        return new Response(JSON.stringify({ success: true, product: updated }), { status: 200, headers });
      }

      if (action === "unpublish" && request.method === "POST") {
        const updated = productDatabase.updateProduct(id, { published: false });
        return new Response(JSON.stringify({ success: true, product: updated }), { status: 200, headers });
      }

      if (action === "duplicate" && request.method === "POST") {
        const duplicated = productDatabase.duplicateProduct(id);
        return new Response(JSON.stringify({ success: true, product: duplicated }), { status: 201, headers });
      }

      if (action === "restore" && request.method === "POST") {
        const restored = productDatabase.restoreProduct(id);
        return new Response(JSON.stringify({ success: true, product: restored }), { status: 200, headers });
      }

      // Single Product CRUD: /api/admin/products/:id
      if (!action) {
        if (request.method === "GET") {
          const product = productDatabase.getProductById(id);
          if (!product) {
            return new Response(JSON.stringify({ success: false, error: `Product "${id}" not found.` }), { status: 404, headers });
          }
          return new Response(JSON.stringify({ success: true, product }), { status: 200, headers });
        }

        if (request.method === "PATCH" || request.method === "PUT") {
          const body = await request.json().catch(() => ({}));
          try {
            const updated = productDatabase.updateProduct(id, body);
            return new Response(JSON.stringify({ success: true, product: updated }), { status: 200, headers });
          } catch (err: any) {
            return new Response(JSON.stringify({ success: false, error: err?.message || "Failed to update product." }), { status: 400, headers });
          }
        }

        if (request.method === "DELETE") {
          const hard = url.searchParams.get("hard") === "true";
          const success = productDatabase.deleteProduct(id, hard);
          return new Response(JSON.stringify({ success }), { status: success ? 200 : 404, headers });
        }
      }
    }

    if (path === "/api/admin/products") {
      if (request.method === "GET") {
        const search = url.searchParams.get("search") || url.searchParams.get("q") || undefined;
        const category = url.searchParams.get("category") || undefined;
        const status = (url.searchParams.get("status") as any) || "all";
        const stockStatus = (url.searchParams.get("stockStatus") as any) || "all";
        const sort = url.searchParams.get("sort") || "newest";
        const limitStr = url.searchParams.get("limit");
        const offsetStr = url.searchParams.get("offset");
        const limit = limitStr ? parseInt(limitStr, 10) : 50;
        const offset = offsetStr ? parseInt(offsetStr, 10) : 0;

        const result = productDatabase.getAdminProducts({ search, category, status, stockStatus, sort, limit, offset });
        return new Response(JSON.stringify({ success: true, ...result }), { status: 200, headers });
      }

      if (request.method === "POST") {
        const body = await request.json().catch(() => ({}));
        try {
          const created = productDatabase.addProduct(body);
          return new Response(JSON.stringify({ success: true, product: created }), { status: 201, headers });
        } catch (err: any) {
          return new Response(JSON.stringify({ success: false, error: err?.message || "Failed to create product." }), { status: 400, headers });
        }
      }
    }

    // --- ADMIN CATEGORIES API ---
    if (path.startsWith("/api/admin/categories/")) {
      const id = decodeURIComponent(path.replace("/api/admin/categories/", ""));
      if (request.method === "PATCH" || request.method === "PUT") {
        const body = await request.json().catch(() => ({}));
        try {
          const updated = productDatabase.updateCategory(id, body);
          return new Response(JSON.stringify({ success: true, category: updated }), { status: 200, headers });
        } catch (err: any) {
          return new Response(JSON.stringify({ success: false, error: err.message }), { status: 400, headers });
        }
      }
      if (request.method === "DELETE") {
        const deleted = productDatabase.deleteCategory(id);
        return new Response(JSON.stringify({ success: deleted }), { status: deleted ? 200 : 404, headers });
      }
    }

    if (path === "/api/admin/categories") {
      if (request.method === "GET") {
        const categories = productDatabase.getCategories();
        return new Response(JSON.stringify({ success: true, categories }), { status: 200, headers });
      }
      if (request.method === "POST") {
        const body = await request.json().catch(() => ({}));
        try {
          const created = productDatabase.addCategory(body);
          return new Response(JSON.stringify({ success: true, category: created }), { status: 201, headers });
        } catch (err: any) {
          return new Response(JSON.stringify({ success: false, error: err.message }), { status: 400, headers });
        }
      }
    }

    // --- ADMIN INVENTORY API ---
    if (path.startsWith("/api/admin/inventory/") && path.endsWith("/adjust")) {
      const parts = path.replace("/api/admin/inventory/", "").split("/");
      const productId = decodeURIComponent(parts[0]);
      const body = await request.json().catch(() => ({}));
      const { deltaQuantity, reason } = body;
      if (typeof deltaQuantity !== "number") {
        return new Response(JSON.stringify({ success: false, error: "Numeric deltaQuantity is required." }), { status: 400, headers });
      }
      try {
        const res = productDatabase.adjustStock(productId, deltaQuantity, reason || "Admin manual adjustment");
        const movements = productDatabase.getInventoryMovements(productId, 1);
        return new Response(JSON.stringify({ success: true, ...res, movement: movements[0] }), { status: 200, headers });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message }), { status: 400, headers });
      }
    }

    if (path === "/api/admin/inventory") {
      const movements = productDatabase.getInventoryMovements(undefined, 100);
      const adminData = productDatabase.getAdminProducts();
      return new Response(
        JSON.stringify({
          success: true,
          stats: adminData.stats,
          lowStockItems: adminData.products.filter(
            (p) => (p.stockQuantity ?? 0) <= (p.lowStockThreshold || 2)
          ),
          movements,
        }),
        { status: 200, headers }
      );
    }

    // --- ADMIN IMAGE UPLOAD API ---
    if (path === "/api/admin/upload-image" && request.method === "POST") {
      try {
        const body = await request.json().catch(() => ({}));
        const { base64Data } = body || {};

        if (!base64Data || typeof base64Data !== "string") {
          return new Response(
            JSON.stringify({ success: false, error: "base64Data string is required." }),
            { status: 400, headers }
          );
        }

        // Validate format
        const match = base64Data.match(/^data:image\/(png|jpe?g|webp);base64,(.+)$/i);
        if (!match) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Invalid image format. Supported formats: JPG, PNG, WEBP.",
            }),
            { status: 400, headers }
          );
        }

        const ext = match[1].toLowerCase() === "jpeg" ? "jpg" : match[1].toLowerCase();
        const buffer = Buffer.from(match[2], "base64");

        if (buffer.length > 10 * 1024 * 1024) {
          return new Response(
            JSON.stringify({ success: false, error: "Image file exceeds 10MB limit." }),
            { status: 400, headers }
          );
        }

        // Generate safe unique filename
        const safeName = `${Date.now()}_${Math.floor(Math.random() * 10000)}.${ext}`;
        const uploadDir = pathModule.resolve(process.cwd(), "public/images/products");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        fs.writeFileSync(pathModule.join(uploadDir, safeName), buffer);

        const publicUrl = `/images/products/${safeName}`;
        return new Response(
          JSON.stringify({ success: true, url: publicUrl, filename: safeName }),
          { status: 201, headers }
        );
      } catch (uploadErr: any) {
        return new Response(
          JSON.stringify({
            success: false,
            error: uploadErr.message || "Failed to upload image.",
          }),
          { status: 500, headers }
        );
      }
    }

    // --- ADMIN AUDIT LOGS API ---
    if (path === "/api/admin/audit-logs" && request.method === "GET") {
      const limitStr = url.searchParams.get("limit");
      const logs = productDatabase.getAuditLogs(limitStr ? parseInt(limitStr, 10) : 100);
      return new Response(JSON.stringify({ success: true, logs }), { status: 200, headers });
    }

    // --- PUBLIC PRODUCTS API ---
    if (path === "/api/products" || path.startsWith("/api/products/")) {
      // GET /api/products/slug/:slug
      if (path.startsWith("/api/products/slug/")) {
        const slug = decodeURIComponent(path.replace("/api/products/slug/", ""));
        const product = productDatabase.getProductBySlug(slug);
        if (
          !product ||
          product.published === false ||
          product.active === false ||
          product.deletedAt ||
          product.archivedAt ||
          product.status === "archived" ||
          product.status === "draft"
        ) {
          return new Response(JSON.stringify({ error: `Product with slug "${slug}" not found` }), {
            status: 404,
            headers,
          });
        }
        return new Response(JSON.stringify(product), { headers });
      }

      // GET /api/products/:id
      if (path !== "/api/products" && path !== "/api/products/") {
        const id = decodeURIComponent(path.replace("/api/products/", ""));
        const product = productDatabase.getPublicProductById(id);
        if (
          !product ||
          product.published === false ||
          product.active === false ||
          product.deletedAt ||
          product.archivedAt ||
          product.status === "archived" ||
          product.status === "draft"
        ) {
          return new Response(JSON.stringify({ error: `Product with ID "${id}" not found` }), {
            status: 404,
            headers,
          });
        }
        return new Response(JSON.stringify(product), { headers });
      }

      // GET /api/products (Public filtered collection)
      if (request.method === "GET") {
        const category = url.searchParams.get("category") || undefined;
        const subcategory = url.searchParams.get("subcategory") || undefined;
        const fabric = url.searchParams.get("fabric") || undefined;
        const color = url.searchParams.get("color") || undefined;
        const colors = url.searchParams.get("colors") || undefined;
        const tier = url.searchParams.get("tier") || undefined;
        const minPriceStr = url.searchParams.get("minPrice");
        const maxPriceStr = url.searchParams.get("maxPrice");
        const minPrice = minPriceStr ? parseFloat(minPriceStr) : undefined;
        const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : undefined;
        const search = url.searchParams.get("search") || url.searchParams.get("q") || undefined;
        const sort = url.searchParams.get("sort") || "featured";
        const limitStr = url.searchParams.get("limit");
        const offsetStr = url.searchParams.get("offset");
        const limit = limitStr ? parseInt(limitStr, 10) : undefined;
        const offset = offsetStr ? parseInt(offsetStr, 10) : undefined;

        const result = productDatabase.getPublicProducts({
          category,
          subcategory,
          fabric,
          color,
          colors,
          tier,
          minPrice,
          maxPrice,
          search,
          sort,
          limit,
          offset,
        });

        return new Response(JSON.stringify(result.products), { headers });
      }
    }

    // --- PUBLIC CATEGORIES API ---
    if (path === "/api/categories" || path.startsWith("/api/categories/")) {
      if (request.method === "GET") {
        if (path !== "/api/categories" && path !== "/api/categories/") {
          const slug = decodeURIComponent(path.replace("/api/categories/", ""));
          const cat = productDatabase.getCategoryBySlug(slug);
          if (!cat) {
            return new Response(JSON.stringify({ error: `Category "${slug}" not found` }), {
              status: 404,
              headers,
            });
          }
          const products = productDatabase.getPublicProducts({ category: cat.name }).products;
          return new Response(JSON.stringify({ ...cat, products }), { headers });
        }

        const categories = productDatabase.getCategories().filter((c) => c.active !== false);
        return new Response(JSON.stringify(categories), { headers });
      }
    }

    // --- AUTHORITATIVE CART API ---
    if (path === "/api/cart" || path.startsWith("/api/cart/")) {
      // POST /api/cart: Authoritatively calculate prices from server-side DB
      if (request.method === "POST") {
        const body = await request.json();
        const { items, promoCode, shippingMethod } = body || {};

        try {
          const calculation = backendDB.calculateCartTotals(items || [], promoCode, shippingMethod);
          return new Response(JSON.stringify({ success: true, cart: calculation }), {
            status: 200,
            headers,
          });
        } catch (err: any) {
          return new Response(
            JSON.stringify({ success: false, error: err.message || "Cart calculation error" }),
            { status: 400, headers },
          );
        }
      }

      // GET /api/cart/:id (session cart lookup)
      if (request.method === "GET") {
        return new Response(
          JSON.stringify({
            status: "active",
            message: "Cart session active. Submit items to POST /api/cart for authoritative valuation.",
          }),
          { headers },
        );
      }

      // PATCH /api/cart/:id or DELETE /api/cart/:id
      if (request.method === "PATCH" || request.method === "DELETE") {
        return new Response(JSON.stringify({ success: true }), { headers });
      }
    }

    // --- POS IN-STORE SALE API ---
    if (path === "/api/pos/sale") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
          status: 405,
          headers,
        });
      }

      const body = await request.json();
      try {
        const posOrder = backendDB.createPOSSale(body);
        return new Response(
          JSON.stringify({
            success: true,
            order: posOrder,
            message: "In-store POS sale confirmed and inventory synchronized successfully.",
          }),
          { status: 201, headers },
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ success: false, error: err.message || "POS sale failed" }),
          { status: 400, headers },
        );
      }
    }

    // --- INVENTORY ADJUSTMENT API ---
    if (path === "/api/inventory/adjust") {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
          status: 405,
          headers,
        });
      }

      const body = await request.json();
      const { productId, deltaQuantity, reason } = body || {};
      if (!productId || typeof deltaQuantity !== "number") {
        return new Response(
          JSON.stringify({ error: "productId and numeric deltaQuantity are required" }),
          { status: 400, headers },
        );
      }

      const result = backendDB.adjustStock(productId, deltaQuantity, reason);
      return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 400,
        headers,
      });
    }

    // --- SOURCES API ---
    if (path === "/api/sources") {
      if (request.method === "GET") {
        return new Response(JSON.stringify(backendDB.getSources()), { headers });
      }
      if (request.method === "POST") {
        const body = await request.json();
        const created = backendDB.addSource(body);
        return new Response(JSON.stringify(created), { status: 201, headers });
      }
    }

    // --- ORDERS API ---
    if (path === "/api/orders" || path.startsWith("/api/orders/")) {
      // GET /api/orders/:id
      if (path !== "/api/orders" && path !== "/api/orders/") {
        const orderId = decodeURIComponent(path.replace("/api/orders/", ""));

        // PATCH /api/orders/:id/status
        if (orderId.includes("/status")) {
          const cleanId = orderId.replace("/status", "");
          if (request.method === "PATCH" || request.method === "POST") {
            const body = await request.json();
            const updated = backendDB.updateOrderStatus(cleanId, body.status);
            if (!updated) {
              return new Response(JSON.stringify({ error: "Order not found" }), {
                status: 404,
                headers,
              });
            }
            return new Response(JSON.stringify(updated), { headers });
          }
        }

        if (request.method === "GET") {
          const order = backendDB.getOrderById(orderId);
          if (!order) {
            return new Response(JSON.stringify({ error: "Order not found" }), {
              status: 404,
              headers,
            });
          }
          return new Response(JSON.stringify(order), { headers });
        }
      }

      if (request.method === "GET") {
        return new Response(JSON.stringify(backendDB.getOrders()), { headers });
      }
      if (request.method === "POST") {
        const body = await request.json();
        const created = backendDB.createOrder(body);
        return new Response(JSON.stringify(created), { status: 201, headers });
      }
    }

    if (path === "/api/currency") {
      if (request.method === "GET") {
        const action = url.searchParams.get("action");
        if (action === "rates") {
          const base = url.searchParams.get("base") || "USD";
          try {
            const ratesData = await exchangeRateServerService.getRates(base);
            return new Response(JSON.stringify(ratesData), { status: 200, headers });
          } catch (err: any) {
            return new Response(
              JSON.stringify({
                success: false,
                error: err?.message || "Failed to retrieve rates.",
              }),
              { status: 400, headers },
            );
          }
        }

        if (action === "codes") {
          try {
            const codes = await exchangeRateServerService.getSupportedCurrencies();
            return new Response(JSON.stringify({ success: true, codes }), {
              status: 200,
              headers,
            });
          } catch (err: any) {
            return new Response(
              JSON.stringify({
                success: false,
                error: err?.message || "Failed to retrieve supported codes.",
              }),
              { status: 400, headers },
            );
          }
        }

        const from = url.searchParams.get("from");
        const to = url.searchParams.get("to");
        const amountStr = url.searchParams.get("amount");

        if (!from || !to) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Missing required query parameters: 'from' and 'to' currencies are required.",
            }),
            { status: 400, headers },
          );
        }

        const amount = amountStr !== null && amountStr !== "" ? Number(amountStr) : 1;

        try {
          const result = await exchangeRateServerService.convert({ from, to, amount });
          return new Response(JSON.stringify(result), { status: 200, headers });
        } catch (err: any) {
          return new Response(
            JSON.stringify({
              success: false,
              error: err?.message || "Currency conversion failed.",
            }),
            { status: 400, headers },
          );
        }
      }

      if (request.method === "POST") {
        try {
          const body = await request.json();
          const { from, to, amount = 1 } = body || {};

          if (!from || !to) {
            return new Response(
              JSON.stringify({
                success: false,
                error:
                  "Missing required fields: 'from' and 'to' currencies are required in request body.",
              }),
              { status: 400, headers },
            );
          }

          const result = await exchangeRateServerService.convert({
            from,
            to,
            amount: Number(amount),
          });
          return new Response(JSON.stringify(result), { status: 200, headers });
        } catch (err: any) {
          return new Response(
            JSON.stringify({
              success: false,
              error: err?.message || "Currency conversion failed.",
            }),
            { status: 400, headers },
          );
        }
      }

      return new Response(
        JSON.stringify({ success: false, error: "Method not allowed. Use GET or POST." }),
        { status: 405, headers },
      );
    }

    return new Response(JSON.stringify({ error: "Endpoint not found" }), {
      status: 404,
      headers,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Internal server error" }), {
      status: 500,
      headers,
    });
  }
}

export default async function handler(req: any, res: any) {
  // If invoked with Web Standard Request
  if (req instanceof Request || (req?.url && typeof req?.headers?.get === "function")) {
    try {
      const apiResponse = await handleApiRequests(req);
      if (apiResponse) return apiResponse;

      return new Response(JSON.stringify({ error: "Endpoint not found" }), {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    } catch (error: any) {
      console.error("API error:", error);
      return new Response(JSON.stringify({ error: error?.message || "Internal server error" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  }

  // If invoked with Node.js req / res
  try {
    const host = req.headers?.host || "localhost";
    const protocol = req.headers?.["x-forwarded-proto"] || "https";
    const fullUrl = new URL(req.url, `${protocol}://${host}`);

    let rawBody: string | undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      if (req.body && typeof req.body === "object") {
        rawBody = JSON.stringify(req.body);
      } else if (typeof req.body === "string") {
        rawBody = req.body;
      } else {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
        }
        if (chunks.length > 0) {
          rawBody = Buffer.concat(chunks).toString("utf-8");
        }
      }
    }

    const headersInit: Record<string, string> = {};
    if (req.headers) {
      for (const [key, value] of Object.entries(req.headers)) {
        if (typeof value === "string") {
          headersInit[key] = value;
        } else if (Array.isArray(value)) {
          headersInit[key] = value.join(", ");
        }
      }
    }

    const webReq = new Request(fullUrl.toString(), {
      method: req.method,
      headers: headersInit,
      body: rawBody,
    });

    const response = await handleApiRequests(webReq);

    if (!response) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Endpoint not found" }));
      return;
    }

    res.statusCode = response.status;
    response.headers.forEach((val, key) => {
      res.setHeader(key, val);
    });

    const responseText = await response.text();
    res.end(responseText);
  } catch (err: any) {
    console.error("Serverless handler error:", err);
    if (res && !res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: err?.message || "Internal server error" }));
    }
  }
}
