import "./lib/error-capture";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { backendDB } from "./lib/backend-api";
import { aiTryOnService } from "./services/aiTryOnService";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

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
      return new Response(JSON.stringify(backendDB.getHealthStatus()), { headers });
    }

    if (path === "/api/products") {
      if (request.method === "GET") {
        const cat = url.searchParams.get("category") || undefined;
        const q = url.searchParams.get("q") || undefined;
        const products = backendDB.getProducts({ category: cat, search: q });
        return new Response(JSON.stringify(products), { headers });
      }

      if (request.method === "POST") {
        const body = await request.json();
        const created = backendDB.addProduct(body);
        return new Response(JSON.stringify(created), { status: 201, headers });
      }
    }

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

    if (path === "/api/orders") {
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
            { status: 400, headers }
          );
        }
        if (!body.product || !body.product.productId) {
          return new Response(
            JSON.stringify({ success: false, error: "Missing product details for virtual try-on." }),
            { status: 400, headers }
          );
        }

        const result = await aiTryOnService.runTryOn(body);
        return new Response(JSON.stringify(result), { status: 200, headers });
      }

      if (request.method === "GET") {
        const id = url.searchParams.get("id") || path.split("/").pop();
        if (!id || id === "ai-try-on") {
          return new Response(
            JSON.stringify({ error: "Missing try-on request ID" }),
            { status: 400, headers }
          );
        }
        const status = await aiTryOnService.getStatus(id);
        if (!status) {
          return new Response(
            JSON.stringify({ error: "Try-on session not found or expired" }),
            { status: 404, headers }
          );
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

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      // Check API router first
      const apiResponse = await handleApiRequests(request);
      if (apiResponse) return apiResponse;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
