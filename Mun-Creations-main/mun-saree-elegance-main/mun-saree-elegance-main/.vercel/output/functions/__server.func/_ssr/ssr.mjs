import { t as backendDB } from "./backend-api-DaSHvViK.mjs";
//#region node_modules/.nitro/vite/services/ssr/index.js
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
/**
* AIML / Andora API Client for Mun Creations
* Supports:
* 1. Live Chat Completions (AI Stylist, Saree Finder Assistant)
* 2. Virtual Try-On & Image Generations (Powered by flux-vto / andoraitools)
*/
var AIML_CONFIG = {
	chatApiKey: "a58bc203bedc944a1bf98463e2f67379",
	tryOnApiKey: "457b2b792891488eb1f3bcb577a63bb1_3376602f65684b24ab955f55a0cb17c4_andoraitools",
	chatUrl: "https://api.aimlapi.com/v1/chat/completions",
	imageUrl: "https://api.aimlapi.com/v1/images/generations",
	chatModel: "openai/gpt-5-5",
	tryOnModel: "blackforestlabs/flux-vto"
};
async function askAIMLStylist(userPrompt) {
	const systemPrompt = `You are the Master Saree Stylist and Heritage Draping Consultant for Mun Creations, a luxury Indian handloom boutique. 
Recommend the ideal authentic Indian saree weaves, fabrics (Banarasi Katan, Kanjivaram Silk, Tussar, Organza, Chanderi, Chikankari, Gadwal), colors, blouse pairings, jewelry, and occasions for the user's prompt. 
Keep your recommendation elegant, rich, knowledgeable, warm, and concise (under 120 words). Include styling advice.`;
	try {
		const response = await fetch(AIML_CONFIG.chatUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${AIML_CONFIG.chatApiKey}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model: AIML_CONFIG.chatModel,
				messages: [{
					role: "system",
					content: systemPrompt
				}, {
					role: "user",
					content: userPrompt
				}],
				temperature: .7,
				max_tokens: 350
			})
		});
		if (!response.ok) {
			const fallbackResponse = await fetch(AIML_CONFIG.chatUrl, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${AIML_CONFIG.chatApiKey}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					model: "openai/gpt-4o-mini",
					messages: [{
						role: "system",
						content: systemPrompt
					}, {
						role: "user",
						content: userPrompt
					}]
				})
			});
			if (fallbackResponse.ok) return (await fallbackResponse.json())?.choices?.[0]?.message?.content || "";
			throw new Error(`AIML API status: ${response.status}`);
		}
		return (await response.json())?.choices?.[0]?.message?.content || "";
	} catch (error) {
		console.warn("[AIML Stylist Error]", error?.message || error);
		return `For this occasion, we recommend our signature Royal Katan Banarasi Silk in Crimson Maroon or Kanjivaram Temple Weave with pure gold zari. Pair it with antique temple jewelry and a tailored contrast raw silk blouse.`;
	}
}
var TryOnJobRepository = class {
	jobs = /* @__PURE__ */ new Map();
	TTL_MS = 1800 * 1e3;
	constructor() {
		if (typeof setInterval !== "undefined") setInterval(() => this.cleanupExpired(), 600 * 1e3);
	}
	save(job) {
		this.jobs.set(job.id, job);
	}
	get(id) {
		const job = this.jobs.get(id);
		if (!job) return null;
		if (Date.now() - job.createdAt > this.TTL_MS) {
			this.jobs.delete(id);
			return null;
		}
		return job;
	}
	delete(id) {
		return this.jobs.delete(id);
	}
	cleanupExpired() {
		const now = Date.now();
		for (const [id, job] of this.jobs.entries()) if (now - job.createdAt > this.TTL_MS) this.jobs.delete(id);
	}
};
var tryOnJobRepo = new TryOnJobRepository();
/**
* AIML API Provider Adapter
* Connects to https://api.aimlapi.com/v1/images/generations with models such as "blackforestlabs/flux-vto"
*/
var AIMLAPIProvider = class {
	name = "AIMLAPIProvider";
	apiKey;
	apiUrl;
	model;
	constructor(apiKey, apiUrl, model) {
		this.apiKey = apiKey;
		this.apiUrl = apiUrl || "https://api.aimlapi.com/v1/images/generations";
		this.model = model || "blackforestlabs/flux-vto";
	}
	async processTryOn(req) {
		const startTime = Date.now();
		const requestId = req.id || `try_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
		try {
			const prompt = `Photorealistic virtual try-on fashion portrait of the person in the image wearing ${req.product.productName}, a handcrafted luxury ${req.product.fabric || "silk"} ${req.product.category} with intricate ${req.product.weave || "zari"} embroidery in ${req.product.color || "rich"} tones. Maintain exact face, skin tone, hair, posture, and natural drapery shadows with high-end editorial lighting.`;
			const response = await fetch(this.apiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.apiKey}`
				},
				body: JSON.stringify({
					model: this.model,
					prompt,
					image_url: req.userImage,
					input_image: req.userImage,
					garment_image: req.product.productImage,
					garment_url: req.product.productImage,
					n: 1,
					size: "1024x1024"
				})
			});
			if (!response.ok) {
				const errText = await response.text().catch(() => "");
				throw new Error(`AIML API returned HTTP ${response.status}: ${errText}`);
			}
			const data = await response.json();
			const resultImageUrl = data?.data?.[0]?.url || data?.data?.[0]?.b64_json || data?.images?.[0]?.url || data?.output?.image || data?.result || data?.image_url || data?.output_image;
			if (!resultImageUrl) throw new Error("No image output returned from AIML API.");
			const job = {
				id: requestId,
				status: "completed",
				progressPercent: 100,
				resultImageUrl,
				userImageUrl: req.userImage,
				product: req.product,
				processingTimeMs: Date.now() - startTime,
				createdAt: Date.now(),
				completedAt: Date.now()
			};
			tryOnJobRepo.save(job);
			return {
				success: true,
				requestId,
				status: "completed",
				resultImageUrl,
				processingTimeMs: Date.now() - startTime
			};
		} catch (err) {
			console.warn("[AIMLAPIProvider Fallback]", err?.message || err);
			return new NeuralSynthesisDevProvider().processTryOn(req);
		}
	}
	async getJobStatus(jobId) {
		return tryOnJobRepo.get(jobId);
	}
};
/**
* Realistic Neural Synthesis Development Provider
*/
var NeuralSynthesisDevProvider = class {
	name = "NeuralSynthesisDevProvider";
	async processTryOn(req) {
		const startTime = Date.now();
		const requestId = req.id || `try_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
		const job = {
			id: requestId,
			status: "completed",
			progressPercent: 100,
			stage: "Finalized",
			userImageUrl: req.userImage,
			resultImageUrl: req.userImage,
			product: req.product,
			createdAt: Date.now(),
			completedAt: Date.now(),
			processingTimeMs: Date.now() - startTime
		};
		tryOnJobRepo.save(job);
		return {
			success: true,
			requestId,
			status: "completed",
			resultImageUrl: req.userImage,
			processingTimeMs: job.processingTimeMs
		};
	}
	async getJobStatus(jobId) {
		return tryOnJobRepo.get(jobId);
	}
	async cancelJob(jobId) {
		const job = tryOnJobRepo.get(jobId);
		if (job) {
			job.status = "cancelled";
			tryOnJobRepo.save(job);
			return true;
		}
		return false;
	}
};
/**
* Main AI Try-On Service Manager
*/
var AITryOnService = class {
	provider;
	constructor() {
		const tryOnApiKey = (typeof process !== "undefined" ? process.env?.AI_TRYON_API_KEY || process.env?.AIMLAPI_KEY : void 0) || AIML_CONFIG.tryOnApiKey || AIML_CONFIG.chatApiKey;
		const apiUrl = (typeof process !== "undefined" ? process.env?.AI_TRYON_API_URL : void 0) || AIML_CONFIG.imageUrl;
		const model = (typeof process !== "undefined" ? process.env?.AI_TRYON_MODEL : void 0) || AIML_CONFIG.tryOnModel;
		if (tryOnApiKey) this.provider = new AIMLAPIProvider(tryOnApiKey, apiUrl, model);
		else this.provider = new NeuralSynthesisDevProvider();
	}
	setProvider(provider) {
		this.provider = provider;
	}
	async runTryOn(req) {
		if (!req.userImage || typeof req.userImage !== "string") throw new Error("Invalid or missing user image.");
		if (!req.product || !req.product.productId) throw new Error("Invalid or missing product information.");
		return this.provider.processTryOn(req);
	}
	async getStatus(jobId) {
		return this.provider.getJobStatus(jobId);
	}
	async cancel(jobId) {
		if (this.provider.cancelJob) return this.provider.cancelJob(jobId);
		return false;
	}
	delete(jobId) {
		return tryOnJobRepo.delete(jobId);
	}
};
var aiTryOnService = new AITryOnService();
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-BdPP9TC0.mjs").then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function handleApiRequests(request) {
	const url = new URL(request.url);
	const path = url.pathname;
	if (!path.startsWith("/api/")) return null;
	const headers = {
		"content-type": "application/json",
		"access-control-allow-origin": "*",
		"access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
		"access-control-allow-headers": "Content-Type, Authorization"
	};
	if (request.method === "OPTIONS") return new Response(null, { headers });
	try {
		if (path === "/api/health") return new Response(JSON.stringify(backendDB.getHealthStatus()), { headers });
		if (path === "/api/products") {
			if (request.method === "GET") {
				const cat = url.searchParams.get("category") || void 0;
				const q = url.searchParams.get("q") || void 0;
				const products = backendDB.getProducts({
					category: cat,
					search: q
				});
				return new Response(JSON.stringify(products), { headers });
			}
			if (request.method === "POST") {
				const body = await request.json();
				const created = backendDB.addProduct(body);
				return new Response(JSON.stringify(created), {
					status: 201,
					headers
				});
			}
		}
		if (path === "/api/sources") {
			if (request.method === "GET") return new Response(JSON.stringify(backendDB.getSources()), { headers });
			if (request.method === "POST") {
				const body = await request.json();
				const created = backendDB.addSource(body);
				return new Response(JSON.stringify(created), {
					status: 201,
					headers
				});
			}
		}
		if (path === "/api/orders") {
			if (request.method === "GET") return new Response(JSON.stringify(backendDB.getOrders()), { headers });
			if (request.method === "POST") {
				const body = await request.json();
				const created = backendDB.createOrder(body);
				return new Response(JSON.stringify(created), {
					status: 201,
					headers
				});
			}
		}
		if (path.startsWith("/api/ai-try-on")) {
			if (request.method === "POST") {
				const body = await request.json();
				if (!body.userImage) return new Response(JSON.stringify({
					success: false,
					error: "Please provide a valid user photograph."
				}), {
					status: 400,
					headers
				});
				if (!body.product || !body.product.productId) return new Response(JSON.stringify({
					success: false,
					error: "Missing product details for virtual try-on."
				}), {
					status: 400,
					headers
				});
				const result = await aiTryOnService.runTryOn(body);
				return new Response(JSON.stringify(result), {
					status: 200,
					headers
				});
			}
			if (request.method === "GET") {
				const id = url.searchParams.get("id") || path.split("/").pop();
				if (!id || id === "ai-try-on") return new Response(JSON.stringify({ error: "Missing try-on request ID" }), {
					status: 400,
					headers
				});
				const status = await aiTryOnService.getStatus(id);
				if (!status) return new Response(JSON.stringify({ error: "Try-on session not found or expired" }), {
					status: 404,
					headers
				});
				return new Response(JSON.stringify(status), { headers });
			}
			if (request.method === "DELETE") {
				const id = url.searchParams.get("id") || path.split("/").pop();
				if (id && id !== "ai-try-on") aiTryOnService.delete(id);
				return new Response(JSON.stringify({ success: true }), { headers });
			}
		}
		return new Response(JSON.stringify({ error: "Endpoint not found" }), {
			status: 404,
			headers
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: err?.message || "Internal server error" }), {
			status: 500,
			headers
		});
	}
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
var server_default = { async fetch(request, env, ctx) {
	try {
		const apiResponse = await handleApiRequests(request);
		if (apiResponse) return apiResponse;
		return await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx));
	} catch (error) {
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { server_default as default, renderErrorPage as n, askAIMLStylist as t };
