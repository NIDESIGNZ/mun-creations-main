import { backendDB } from "./lib/backend-api";
import { aiTryOnService } from "./services/aiTryOnService";
import { razorpayService } from "./services/razorpayService";
import { exchangeRateServerService } from "./services/exchangeRateServerService";

// API router for backend REST endpoints
async function handleApiRequests(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const path = url.pathname;

  if (!path.startsWith("/api/")) return null;

  const headers = {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "Content-Type, Authorization",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    if (path === "/api/health") {
      const dbStatus = backendDB.getHealthStatus();
      const hasKeyId = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID.trim());
      const hasKeySecret = Boolean(
        process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET.trim(),
      );
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
            key_id: process.env.RAZORPAY_KEY_ID,
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

    // --- PRODUCTS API ---
    if (path === "/api/products" || path.startsWith("/api/products/")) {
      // GET /api/products/slug/:slug
      if (path.startsWith("/api/products/slug/")) {
        const slug = decodeURIComponent(path.replace("/api/products/slug/", ""));
        const product = backendDB.getProductBySlug(slug);
        if (!product) {
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
        if (request.method === "GET") {
          const product = backendDB.getProductById(id);
          if (!product) {
            return new Response(JSON.stringify({ error: `Product with ID "${id}" not found` }), {
              status: 404,
              headers,
            });
          }
          return new Response(JSON.stringify(product), { headers });
        }

        if (request.method === "PUT" || request.method === "PATCH") {
          const body = await request.json();
          const updated = backendDB.updateProduct(id, body);
          if (!updated) {
            return new Response(JSON.stringify({ error: `Product with ID "${id}" not found` }), {
              status: 404,
              headers,
            });
          }
          return new Response(JSON.stringify(updated), { headers });
        }

        if (request.method === "DELETE") {
          const deleted = backendDB.deleteProduct(id);
          return new Response(JSON.stringify({ success: deleted }), { headers });
        }
      }

      // Collection endpoints: GET /api/products & POST /api/products
      if (request.method === "GET") {
        const cat = url.searchParams.get("category") || undefined;
        const q = url.searchParams.get("q") || undefined;
        let products = backendDB.getProducts({ category: cat, search: q });

        // Optional query filters
        const fabric = url.searchParams.get("fabric");
        if (fabric) {
          products = products.filter(
            (p) => p.fabric && p.fabric.toLowerCase() === fabric.toLowerCase(),
          );
        }

        const color = url.searchParams.get("color");
        if (color) {
          products = products.filter(
            (p) => p.color && p.color.toLowerCase() === color.toLowerCase(),
          );
        }

        const tier = url.searchParams.get("tier");
        if (tier) {
          products = products.filter(
            (p) => p.priceTier && p.priceTier.toLowerCase() === tier.toLowerCase(),
          );
        }

        const sort = url.searchParams.get("sort");
        if (sort === "price-low") {
          products.sort((a, b) => a.priceUsd - b.priceUsd);
        } else if (sort === "price-high") {
          products.sort((a, b) => b.priceUsd - a.priceUsd);
        } else if (sort === "newest") {
          products.sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
          );
        }

        return new Response(JSON.stringify(products), { headers });
      }

      if (request.method === "POST") {
        const body = await request.json();
        const created = backendDB.addProduct(body);
        return new Response(JSON.stringify(created), { status: 201, headers });
      }
    }

    // --- CATEGORIES API ---
    if (path === "/api/categories" || path.startsWith("/api/categories/")) {
      if (request.method === "GET") {
        if (path !== "/api/categories" && path !== "/api/categories/") {
          const slug = decodeURIComponent(path.replace("/api/categories/", ""));
          const cat = backendDB.getCategoryBySlug(slug);
          if (!cat) {
            return new Response(JSON.stringify({ error: `Category "${slug}" not found` }), {
              status: 404,
              headers,
            });
          }
          return new Response(JSON.stringify(cat), { headers });
        }

        const categories = backendDB.getCategories();
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

    if (path.startsWith("/api/ai-try-on")) {
      if (request.method === "POST") {
        const body = await request.json();
        if (!body.userImage) {
          return new Response(
            JSON.stringify({ success: false, error: "Please provide a valid user photograph." }),
            { status: 400, headers },
          );
        }
        if (!body.product || !body.product.productId) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Missing product details for virtual try-on.",
            }),
            { status: 400, headers },
          );
        }

        const result = await aiTryOnService.runTryOn(body);
        return new Response(JSON.stringify(result), { status: 200, headers });
      }

      if (request.method === "GET") {
        const id = url.searchParams.get("id") || path.split("/").pop();
        if (!id || id === "ai-try-on") {
          return new Response(JSON.stringify({ error: "Missing try-on request ID" }), {
            status: 400,
            headers,
          });
        }
        const status = await aiTryOnService.getStatus(id);
        if (!status) {
          return new Response(JSON.stringify({ error: "Try-on session not found or expired" }), {
            status: 404,
            headers,
          });
        }
        return new Response(JSON.stringify(status), { headers });
      }

      if (request.method === "DELETE") {
        const id = url.searchParams.get("id") || path.split("/").pop();
        if (id && id !== "ai-try-on") {
          aiTryOnService.delete(id);
        }
        return new Response(JSON.stringify({ success: true }), { headers });
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
