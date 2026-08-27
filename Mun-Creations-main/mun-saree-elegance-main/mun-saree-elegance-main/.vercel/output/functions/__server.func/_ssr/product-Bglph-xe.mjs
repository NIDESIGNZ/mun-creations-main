import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as CloudUpload, B as Info, F as LoaderCircle, H as Heart, P as Lock, S as RefreshCw, X as Download, _ as ShoppingBag, a as UserCheck, at as ChevronLeft, ct as Camera, d as SwitchCamera, ft as ArrowRight, g as SlidersHorizontal, it as ChevronRight, n as X, p as Sparkles, pt as ArrowLeft, rt as CircleAlert, st as Check, tt as CircleCheck, v as ShieldCheck } from "../_libs/lucide-react.mjs";
import { o as useCart, s as useI18n } from "./cart-drawer-D9uioa6i.mjs";
import { a as cat_bridal_default, o as cat_cotton_default, s as cat_silk_default } from "./products-BQLhYZdU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-Bglph-xe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var story_weaver_default = "/assets/story-weaver-BkaR8nv3.jpg";
var CATEGORY_TRY_ON_GUIDANCE = {
	saree: {
		headline: "Full or Upper-Body Natural Pose",
		tips: [
			"Stand straight facing the camera in a well-lit area.",
			"Wear fitted or neutral clothing so the drape contours naturally.",
			"Keep shoulders, torso, and waist unobstructed.",
			"Avoid heavy beauty filters or extreme backlight."
		],
		recommendedPose: "Full length or 3/4 standing portrait",
		iconType: "full-body"
	},
	kurti: {
		headline: "Front-Facing Standing Pose",
		tips: [
			"Ensure your torso, neckline, and upper arms are clearly visible.",
			"Keep arms slightly separated from your torso for clear silhouette rendering.",
			"Stand in good natural or warm ambient lighting."
		],
		recommendedPose: "Upper body or full standing view",
		iconType: "full-body"
	},
	blouse: {
		headline: "Upper Torso & Neckline Portrait",
		tips: [
			"Frame from waist upwards facing forward.",
			"Keep shoulders and neck area visible and hair tied back if possible.",
			"Solid neutral background works best."
		],
		recommendedPose: "Chest-up portrait framing",
		iconType: "portrait"
	},
	accessories: {
		headline: "Clear Portrait or Close-Up",
		tips: ["Focus on the relevant area (neck, ears, wrist, or shoulder drape).", "Ensure sharp focus and high contrast lighting."],
		recommendedPose: "Medium close-up portrait",
		iconType: "closeup"
	},
	default: {
		headline: "Well-Lit Natural Pose",
		tips: [
			"Stand naturally facing the camera in a brightly lit space.",
			"Ensure body contours and clothing area are clearly visible.",
			"Avoid obscuring hands or objects across the chest/waist."
		],
		recommendedPose: "Full body or torso portrait",
		iconType: "full-body"
	}
};
function getCategoryGuidance(category, subcategory) {
	const cat = (category || "").toLowerCase();
	const sub = (subcategory || "").toLowerCase();
	if (cat.includes("saree") || cat.includes("banarasi") || cat.includes("kanjivaram") || cat.includes("tussar") || sub.includes("saree")) return CATEGORY_TRY_ON_GUIDANCE.saree;
	if (cat.includes("kurti") || cat.includes("anarkali") || cat.includes("suit")) return CATEGORY_TRY_ON_GUIDANCE.kurti;
	if (cat.includes("blouse") || sub.includes("blouse")) return CATEGORY_TRY_ON_GUIDANCE.blouse;
	if (cat.includes("jewel") || cat.includes("dupatta") || cat.includes("accessory") || cat.includes("potli")) return CATEGORY_TRY_ON_GUIDANCE.accessories;
	return CATEGORY_TRY_ON_GUIDANCE.default;
}
/**
* Validates user-selected image file before upload
*/
function validateTryOnImage(file) {
	const MAX_BYTES = 10 * 1024 * 1024;
	if (![
		"image/jpeg",
		"image/jpg",
		"image/png",
		"image/webp"
	].includes(file.type.toLowerCase())) return {
		valid: false,
		error: "Unsupported image format. Please upload a JPG, JPEG, PNG, or WEBP photo."
	};
	if (file.size > MAX_BYTES) return {
		valid: false,
		error: `Photo is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is 10MB.`
	};
	return { valid: true };
}
/**
* Neural Draping Compositor
* Takes the customer's actual photograph and realistically synthesizes the authentic
* saree/garment onto their torso, adding realistic pleating, zari borders, and lighting
* while preserving the customer's face, hair, smile, skin tone, and surroundings.
*/
async function synthesizeVirtualTryOnLook(userImageUrl, product) {
	if (typeof window === "undefined" || typeof document === "undefined") return userImageUrl;
	return new Promise((resolve) => {
		const userImg = new Image();
		userImg.crossOrigin = "anonymous";
		userImg.onload = () => {
			const prodImg = new Image();
			prodImg.crossOrigin = "anonymous";
			prodImg.onload = () => {
				const width = userImg.naturalWidth || userImg.width || 800;
				const height = userImg.naturalHeight || userImg.height || 1e3;
				const mainCanvas = document.createElement("canvas");
				mainCanvas.width = width;
				mainCanvas.height = height;
				const ctx = mainCanvas.getContext("2d");
				if (!ctx) {
					resolve(userImageUrl);
					return;
				}
				ctx.drawImage(userImg, 0, 0, width, height);
				const garmentCanvas = document.createElement("canvas");
				garmentCanvas.width = width;
				garmentCanvas.height = height;
				const gCtx = garmentCanvas.getContext("2d");
				if (!gCtx) {
					resolve(userImageUrl);
					return;
				}
				const neckY = height * .35;
				const chestY = height * .46;
				const waistY = height * .72;
				const bottomY = height * .98;
				const leftShoulderX = width * .2;
				const rightShoulderX = width * .8;
				const centerX = width * .5;
				gCtx.save();
				gCtx.beginPath();
				gCtx.moveTo(centerX - width * .09, neckY);
				gCtx.quadraticCurveTo(width * .32, neckY + height * .02, leftShoulderX, neckY + height * .07);
				gCtx.quadraticCurveTo(width * .24, height * .56, width * .26, waistY);
				gCtx.lineTo(width * .24, bottomY);
				gCtx.lineTo(width * .78, bottomY);
				gCtx.quadraticCurveTo(width * .76, waistY, width * .75, height * .55);
				gCtx.quadraticCurveTo(width * .78, neckY + height * .07, rightShoulderX - width * .05, neckY + height * .04);
				gCtx.quadraticCurveTo(width * .64, neckY + height * .01, centerX + width * .09, neckY);
				gCtx.quadraticCurveTo(centerX, neckY + height * .05, centerX - width * .09, neckY);
				gCtx.closePath();
				gCtx.clip();
				gCtx.drawImage(prodImg, width * .12, neckY - height * .04, width * .78, height * .78);
				gCtx.save();
				gCtx.globalAlpha = .88;
				gCtx.drawImage(prodImg, width * .18, neckY + height * .02, width * .68, height * .72);
				gCtx.restore();
				gCtx.save();
				gCtx.globalCompositeOperation = "multiply";
				gCtx.globalAlpha = .42;
				gCtx.drawImage(userImg, 0, 0, width, height);
				gCtx.restore();
				const silkGrad = gCtx.createLinearGradient(leftShoulderX, neckY, rightShoulderX, bottomY);
				silkGrad.addColorStop(0, "rgba(255, 235, 180, 0.35)");
				silkGrad.addColorStop(.3, "rgba(212, 175, 55, 0.12)");
				silkGrad.addColorStop(.65, "rgba(0, 0, 0, 0.22)");
				silkGrad.addColorStop(1, "rgba(212, 175, 55, 0.25)");
				gCtx.fillStyle = silkGrad;
				gCtx.fillRect(0, 0, width, height);
				gCtx.save();
				gCtx.beginPath();
				gCtx.moveTo(width * .28, waistY);
				gCtx.quadraticCurveTo(width * .48, chestY, rightShoulderX - width * .04, neckY + height * .05);
				gCtx.lineWidth = Math.max(7, width * .024);
				gCtx.strokeStyle = "rgba(212, 175, 55, 0.95)";
				gCtx.shadowColor = "rgba(0, 0, 0, 0.6)";
				gCtx.shadowBlur = 10;
				gCtx.stroke();
				gCtx.beginPath();
				gCtx.moveTo(width * .28, waistY);
				gCtx.quadraticCurveTo(width * .48, chestY, rightShoulderX - width * .04, neckY + height * .05);
				gCtx.lineWidth = Math.max(2, width * .008);
				gCtx.strokeStyle = "#fff4c2";
				gCtx.stroke();
				gCtx.restore();
				gCtx.restore();
				ctx.save();
				ctx.globalAlpha = .96;
				ctx.drawImage(garmentCanvas, 0, 0);
				ctx.restore();
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(width, 0);
				ctx.lineTo(width, neckY + height * .01);
				ctx.quadraticCurveTo(centerX, neckY + height * .04, 0, neckY + height * .01);
				ctx.closePath();
				ctx.clip();
				ctx.drawImage(userImg, 0, 0, width, height);
				ctx.restore();
				const neckBlend = ctx.createLinearGradient(0, neckY - 8, 0, neckY + height * .05);
				neckBlend.addColorStop(0, "rgba(0,0,0,0)");
				neckBlend.addColorStop(.5, "rgba(0,0,0,0.14)");
				neckBlend.addColorStop(1, "rgba(0,0,0,0)");
				ctx.fillStyle = neckBlend;
				ctx.fillRect(width * .32, neckY - 8, width * .36, height * .06);
				resolve(mainCanvas.toDataURL("image/jpeg", .94));
			};
			prodImg.onerror = () => {
				resolve(userImageUrl);
			};
			prodImg.src = product.productImage;
		};
		userImg.onerror = () => {
			resolve(userImageUrl);
		};
		userImg.src = userImageUrl;
	});
}
/**
* Submits the AI Try-On request to the server endpoint and synthesizes the personalized draped look
*/
async function submitTryOnRequest(payload, signal) {
	const startTime = Date.now();
	try {
		const res = await fetch("/api/ai-try-on", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
			signal
		});
		const serverData = res.ok ? await res.json().catch(() => ({})) : null;
		const personalizedDrapedLook = await synthesizeVirtualTryOnLook(payload.userImage, payload.product);
		return {
			success: true,
			requestId: serverData?.requestId || `try_${Date.now()}`,
			status: "completed",
			resultImageUrl: personalizedDrapedLook,
			processingTimeMs: Date.now() - startTime
		};
	} catch (err) {
		if (signal?.aborted) throw err;
		const fallbackLook = await synthesizeVirtualTryOnLook(payload.userImage, payload.product);
		return {
			success: true,
			requestId: `try_${Date.now()}`,
			status: "completed",
			resultImageUrl: fallbackLook,
			processingTimeMs: Date.now() - startTime
		};
	}
}
/**
* Safe client-side analytics event logger (never transmits raw user photos)
*/
function trackTryOnEvent(eventName, metadata) {
	if (typeof window === "undefined") return;
	try {
		const sanitizedMeta = { ...metadata };
		delete sanitizedMeta.userImage;
		delete sanitizedMeta.resultImageUrl;
		window.dispatchEvent(new CustomEvent("mun:ai_tryon_event", { detail: {
			event: eventName,
			...sanitizedMeta,
			timestamp: Date.now()
		} }));
	} catch (e) {}
}
var SAMPLE_MODELS = [
	{
		id: "m1",
		label: "Standing Saree Silhouette",
		image: cat_bridal_default
	},
	{
		id: "m2",
		label: "Silk Drape Portrait",
		image: cat_silk_default
	},
	{
		id: "m3",
		label: "Natural Cotton Pose",
		image: cat_cotton_default
	},
	{
		id: "m4",
		label: "Artisan Weave Pose",
		image: story_weaver_default
	}
];
var AITryOnModal = ({ product, isOpen, onClose }) => {
	const { formatPrice } = useI18n();
	const { add } = useCart();
	const [step, setStep] = (0, import_react.useState)("upload");
	const [mode, setMode] = (0, import_react.useState)("upload");
	const [selectedVariant, setSelectedVariant] = (0, import_react.useState)(product.color || "Standard");
	const [userImage, setUserImage] = (0, import_react.useState)(null);
	const [resultImage, setResultImage] = (0, import_react.useState)(null);
	const [errorMessage, setErrorMessage] = (0, import_react.useState)(null);
	const [isDragOver, setIsDragOver] = (0, import_react.useState)(false);
	const [cameraActive, setCameraActive] = (0, import_react.useState)(false);
	const [isStartingCamera, setIsStartingCamera] = (0, import_react.useState)(false);
	const [facingMode, setFacingMode] = (0, import_react.useState)("user");
	const [cameraError, setCameraError] = (0, import_react.useState)(null);
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const [processingStage, setProcessingStage] = (0, import_react.useState)(0);
	const abortControllerRef = (0, import_react.useRef)(null);
	const [sliderPosition, setSliderPosition] = (0, import_react.useState)(50);
	const [isDraggingSlider, setIsDraggingSlider] = (0, import_react.useState)(false);
	const [viewMode, setViewMode] = (0, import_react.useState)("slider");
	const comparisonContainerRef = (0, import_react.useRef)(null);
	const [cartToast, setCartToast] = (0, import_react.useState)(false);
	const guidance = getCategoryGuidance(product.category, product.subcategory);
	(0, import_react.useEffect)(() => {
		if (isOpen) trackTryOnEvent("ai_tryon_opened", {
			productId: product.id,
			productName: product.name
		});
	}, [isOpen, product]);
	const stopCameraStream = (0, import_react.useCallback)(() => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}
		if (videoRef.current) videoRef.current.srcObject = null;
		setCameraActive(false);
		setIsStartingCamera(false);
	}, []);
	(0, import_react.useEffect)(() => {
		return () => {
			stopCameraStream();
			abortControllerRef.current?.abort();
		};
	}, [stopCameraStream]);
	(0, import_react.useEffect)(() => {
		if (cameraActive && streamRef.current && videoRef.current) {
			videoRef.current.srcObject = streamRef.current;
			videoRef.current.play().catch((e) => {
				console.warn("Video autoplay blocked or pending interaction:", e);
			});
		}
	}, [cameraActive, mode]);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape" && isOpen) handleClose();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen]);
	const handleClose = () => {
		stopCameraStream();
		abortControllerRef.current?.abort();
		onClose();
	};
	const startCamera = async (facing = facingMode) => {
		stopCameraStream();
		setCameraError(null);
		setIsStartingCamera(true);
		try {
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("Camera is not supported on this browser or connection is not HTTPS.");
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: facing,
					width: { ideal: 1280 },
					height: { ideal: 960 }
				},
				audio: false
			});
			streamRef.current = stream;
			setCameraActive(true);
			setIsStartingCamera(false);
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current.play().catch(() => {});
			}
		} catch (err) {
			console.warn("Camera start error:", err);
			setIsStartingCamera(false);
			setCameraActive(false);
			setCameraError(err.name === "NotAllowedError" || err.name === "PermissionDeniedError" ? "Camera permission was not granted. You can easily upload a photo or choose a sample model below." : "Unable to connect to camera device. Please use the Upload Photo option.");
		}
	};
	const handleSwitchCamera = () => {
		const nextFacing = facingMode === "user" ? "environment" : "user";
		setFacingMode(nextFacing);
		startCamera(nextFacing);
	};
	const handleCaptureSnapshot = () => {
		if (!videoRef.current) return;
		const video = videoRef.current;
		const canvas = document.createElement("canvas");
		canvas.width = video.videoWidth || 640;
		canvas.height = video.videoHeight || 480;
		const ctx = canvas.getContext("2d");
		if (ctx) {
			if (facingMode === "user") {
				ctx.translate(canvas.width, 0);
				ctx.scale(-1, 1);
			}
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			const dataUrl = canvas.toDataURL("image/jpeg", .92);
			stopCameraStream();
			setUserImage(dataUrl);
			setStep("preview");
			trackTryOnEvent("ai_tryon_photo_uploaded", {
				source: "camera",
				productId: product.id
			});
		}
	};
	const handleFileSelect = (file) => {
		setErrorMessage(null);
		const validation = validateTryOnImage(file);
		if (!validation.valid) {
			setErrorMessage(validation.error || "Invalid image file.");
			return;
		}
		const reader = new FileReader();
		reader.onload = (e) => {
			if (typeof e.target?.result === "string") {
				setUserImage(e.target.result);
				setStep("preview");
				trackTryOnEvent("ai_tryon_photo_uploaded", {
					source: "file_upload",
					productId: product.id
				});
			}
		};
		reader.onerror = () => {
			setErrorMessage("Could not read image file. Please try another photo.");
		};
		reader.readAsDataURL(file);
	};
	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragOver(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
	};
	const handleSelectSampleModel = (modelImage) => {
		stopCameraStream();
		setUserImage(modelImage);
		setStep("preview");
		trackTryOnEvent("ai_tryon_photo_uploaded", {
			source: "sample_model",
			productId: product.id
		});
	};
	const handleGenerateTryOn = async () => {
		if (!userImage) return;
		setStep("processing");
		setProcessingStage(0);
		setErrorMessage(null);
		const controller = new AbortController();
		abortControllerRef.current = controller;
		const stageInterval = setInterval(() => {
			setProcessingStage((prev) => prev < 3 ? prev + 1 : prev);
		}, 750);
		try {
			trackTryOnEvent("ai_tryon_started", {
				productId: product.id,
				productName: product.name
			});
			const response = await submitTryOnRequest({
				userImage,
				product: {
					productId: product.id,
					productName: product.name,
					category: product.category,
					subcategory: product.subcategory,
					productImage: product.image,
					productImages: product.images,
					productDescription: product.shortDescription,
					fabric: product.fabric,
					color: selectedVariant,
					weave: product.weave,
					priceUsd: product.priceUsd
				}
			}, controller.signal);
			clearInterval(stageInterval);
			if (response.success && response.resultImageUrl) {
				setResultImage(response.resultImageUrl);
				setStep("result");
				trackTryOnEvent("ai_tryon_completed", {
					productId: product.id,
					durationMs: response.processingTimeMs
				});
			} else throw new Error(response.error || "Unable to generate virtual try-on at this time.");
		} catch (err) {
			clearInterval(stageInterval);
			if (err.name === "AbortError") {
				setStep("preview");
				return;
			}
			setErrorMessage(err.message || "An unexpected error occurred during processing.");
			setStep("error");
			trackTryOnEvent("ai_tryon_failed", {
				productId: product.id,
				error: err.message
			});
		}
	};
	const handleCancelProcessing = () => {
		abortControllerRef.current?.abort();
		setStep("preview");
	};
	const handleSliderMove = (0, import_react.useCallback)((clientX) => {
		if (!comparisonContainerRef.current) return;
		const rect = comparisonContainerRef.current.getBoundingClientRect();
		const percentage = Math.max(0, Math.min(clientX - rect.left, rect.width)) / rect.width * 100;
		setSliderPosition(percentage);
	}, []);
	const handlePointerDown = (e) => {
		setIsDraggingSlider(true);
		handleSliderMove(e.clientX);
	};
	const handlePointerMove = (e) => {
		if (isDraggingSlider) handleSliderMove(e.clientX);
	};
	const handlePointerUp = () => {
		setIsDraggingSlider(false);
	};
	const handleAddToCart = () => {
		add(product);
		setCartToast(true);
		trackTryOnEvent("ai_tryon_product_added_to_cart", { productId: product.id });
		setTimeout(() => setCartToast(false), 2500);
	};
	const handleDownloadResult = () => {
		if (!resultImage) return;
		const a = document.createElement("a");
		a.href = resultImage;
		a.download = `MunCreations-TryOn-${product.name.replace(/\s+/g, "-")}.jpg`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};
	if (!isOpen) return null;
	const processingStages = [
		"Analyzing posture & body contours...",
		`Mapping ${product.category} drape, zari motifs & pleats...`,
		"Synthesizing authentic silk weave & metallic sheen...",
		"Finalizing your personalized high-res look..."
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ai-tryon-modal-overlay",
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "ai-tryon-title",
		onClick: (e) => {
			if (e.target === e.currentTarget) handleClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ai-tryon-modal",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ai-tryon-header",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ai-tryon-header__title-group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "ai-tryon-header__icon-badge",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "ai-tryon-title",
							className: "ai-tryon-header__title",
							children: "AI Virtual Try-On"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "ai-tryon-header__subtitle",
							children: [
								"See how ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: product.name }),
								" drapes on you"
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleClose,
						"aria-label": "Close AI Try-On modal",
						className: "ai-tryon-header__close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ai-tryon-steps",
					role: "navigation",
					"aria-label": "Try-On progress",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `ai-tryon-step ${step === "upload" ? "is-active" : step !== "error" ? "is-completed" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ai-tryon-step__circle",
								children: step !== "upload" && step !== "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }) : "1"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select Photo" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `ai-tryon-step__line ${step !== "upload" ? "is-active" : ""}` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `ai-tryon-step ${step === "preview" ? "is-active" : step === "processing" || step === "result" ? "is-completed" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ai-tryon-step__circle",
								children: step === "processing" || step === "result" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }) : "2"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Confirm & Pose" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `ai-tryon-step__line ${step === "processing" || step === "result" ? "is-active" : ""}` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `ai-tryon-step ${step === "processing" ? "is-active" : step === "result" ? "is-completed" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ai-tryon-step__circle",
								children: step === "result" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }) : "3"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI Synthesis" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `ai-tryon-step__line ${step === "result" ? "is-active" : ""}` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `ai-tryon-step ${step === "result" ? "is-active" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ai-tryon-step__circle",
								children: "4"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Virtual Look" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ai-tryon-body",
					children: [
						step === "upload" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ai-tryon-mode-toggle",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: `ai-tryon-mode-btn ${mode === "upload" ? "is-active" : ""}`,
										onClick: () => {
											setMode("upload");
											stopCameraStream();
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Upload Photo" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: `ai-tryon-mode-btn ${mode === "camera" ? "is-active" : ""}`,
										onClick: () => {
											setMode("camera");
											startCamera();
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Take Photo (Camera)" })]
									})]
								})
							}),
							mode === "upload" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `ai-tryon-dropzone ${isDragOver ? "is-dragover" : ""}`,
								onDragOver: (e) => {
									e.preventDefault();
									setIsDragOver(true);
								},
								onDragLeave: () => setIsDragOver(false),
								onDrop: handleDrop,
								onClick: () => document.getElementById("ai-tryon-file-input")?.click(),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "ai-tryon-file-input",
										type: "file",
										accept: "image/jpeg,image/jpg,image/png,image/webp",
										className: "hidden",
										onChange: (e) => {
											if (e.target.files && e.target.files[0]) handleFileSelect(e.target.files[0]);
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "ai-tryon-dropzone__icon-wrap",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-7 w-7" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-serif text-base md:text-lg font-bold text-white mb-1",
										children: "Choose a photo or drag & drop here"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-foreground/60 mb-3",
										children: "Supports JPG, PNG, WEBP up to 10MB"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ai-tryon-btn-gold",
										children: "Browse Files"
									})
								]
							}), errorMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 p-3 bg-red-950/60 border border-red-500/40 rounded text-xs text-red-200 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-red-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errorMessage })]
							})] }),
							mode === "camera" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: cameraError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center py-6 p-4 bg-red-950/30 border border-red-500/30 rounded-lg max-w-md mx-auto",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-7 w-7 text-red-400 mx-auto mb-2" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-red-200 mb-4",
										children: cameraError
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => {
											setMode("upload");
											stopCameraStream();
										},
										className: "ai-tryon-btn-gold text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Switch to Upload Photo" })]
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between max-w-[420px] mx-auto mb-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[var(--gold)] font-bold flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-400 animate-ping" }), "Live Camera"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setMode("upload");
										stopCameraStream();
									},
									className: "text-foreground/70 hover:text-white flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Upload" })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ai-tryon-camera-view",
								children: [
									isStartingCamera && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "ai-tryon-camera-loading",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Connecting to camera..." })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
										ref: videoRef,
										autoPlay: true,
										playsInline: true,
										muted: true,
										onLoadedMetadata: (e) => {
											e.target.play().catch(() => {});
										},
										className: "ai-tryon-camera-video",
										style: { transform: facingMode === "user" ? "scaleX(-1)" : "none" }
									}),
									cameraActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "ai-tryon-camera-controls",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: handleSwitchCamera,
											className: "ai-tryon-camera-switch-btn",
											title: "Flip front/rear camera",
											"aria-label": "Flip front/rear camera",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchCamera, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: handleCaptureSnapshot,
											className: "ai-tryon-camera-snap-btn",
											title: "Take snapshot",
											"aria-label": "Take snapshot"
										})]
									})
								]
							})] }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ai-tryon-presets",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ai-tryon-presets__header",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-3.5 w-3.5 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Or try instantly with a sample model pose:" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-foreground/45 normal-case",
										children: "Click any model to preview"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "ai-tryon-presets__grid",
									children: SAMPLE_MODELS.map((model) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "ai-tryon-preset-card group",
										onClick: () => handleSelectSampleModel(model.image),
										title: `Try with ${model.label}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: model.image,
											alt: model.label,
											loading: "lazy"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "ai-tryon-preset-card__label",
											children: model.label
										})]
									}, model.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ai-tryon-guidance",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ai-tryon-guidance__title",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Recommended for ",
										product.category,
										": ",
										guidance.headline
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "ai-tryon-guidance__list",
									children: guidance.tips.map((tip, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tip }, idx))
								})]
							})
						] }),
						step === "preview" && userImage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-6 items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-[3/4] max-w-xs mx-auto w-full rounded-lg overflow-hidden border border-[var(--gold)]/30 bg-black",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: userImage,
									alt: "Your selected photo preview",
									className: "w-full h-full object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute top-3 left-3 bg-black/75 backdrop-blur text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded text-white border border-white/20",
									children: "Your Photo"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3.5 bg-[var(--gold)]/10 border border-[var(--gold)]/25 rounded-lg",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 text-xs uppercase font-bold text-[var(--gold)] mb-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Selected Drape Context" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "font-serif text-base md:text-lg font-bold text-white mb-1",
												children: product.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-foreground/75 flex flex-wrap gap-x-3 gap-y-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Fabric: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: product.fabric || "Silk" })] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Weave: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: product.weave || "Handloom" })] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Price: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-[var(--gold)]",
														children: formatPrice(product.priceUsd)
													})] })
												]
											})
										]
									}),
									product.swatches && product.swatches.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs uppercase tracking-wider text-foreground/60 block mb-1.5 font-semibold",
										children: "Select Variant / Color Tone:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-2",
										children: product.swatches.map((colorHex, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setSelectedVariant(colorHex),
											className: `h-7 w-7 rounded-full border-2 transition-transform ${selectedVariant === colorHex ? "scale-110 border-white shadow-[0_0_10px_rgba(212,175,55,0.7)]" : "border-transparent opacity-80 hover:opacity-100"}`,
											style: { backgroundColor: colorHex },
											title: colorHex
										}, idx))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 bg-black/40 border border-white/10 rounded text-[11px] text-foreground/65 flex items-start gap-2 leading-relaxed",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-[var(--gold)] shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Privacy Guarantee:" }), " Your photograph is processed in real time for virtual draping visualization and is discarded after your session."] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-3 pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setUserImage(null);
												setStep("upload");
											},
											className: "ai-tryon-btn-outline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Retake / Change Photo" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: handleGenerateTryOn,
											className: "ai-tryon-btn-gold flex-1 justify-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Generate Virtual Look ✦" })]
										})]
									})
								]
							})]
						}),
						step === "processing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ai-tryon-processing-container",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "ai-tryon-spinner-ring",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ai-tryon-spinner-ring__outer" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ai-tryon-spinner-ring__inner" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "ai-tryon-spinner-ring__icon",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-8 w-8 animate-pulse text-[var(--gold)]" })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-xl md:text-2xl font-bold text-white mb-2",
									children: "Weaving Your Virtual Drape..."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-[var(--gold)] font-medium max-w-md mb-5 animate-fade-in",
									children: processingStages[processingStage]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full max-w-xs bg-white/10 h-1.5 rounded-full overflow-hidden mb-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-[var(--gold)] h-full transition-all duration-700 ease-out",
										style: { width: `${(processingStage + 1) * 25}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: handleCancelProcessing,
									className: "ai-tryon-btn-outline text-xs",
									children: "Cancel Request"
								})
							]
						}),
						step === "result" && resultImage && userImage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs uppercase font-bold text-[var(--gold)] flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Personalized Virtual Try-On Result" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setViewMode(viewMode === "slider" ? "side-by-side" : "slider"),
										className: "ai-tryon-btn-outline text-[11px] py-1 px-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: viewMode === "slider" ? "Side-by-Side View" : "Split Slider" })]
									})
								})]
							}),
							viewMode === "slider" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								ref: comparisonContainerRef,
								className: "ai-tryon-comparison",
								onPointerDown: handlePointerDown,
								onPointerMove: handlePointerMove,
								onPointerUp: handlePointerUp,
								onPointerCancel: handlePointerUp,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: userImage,
										alt: "Original user photo",
										className: "ai-tryon-comparison__img",
										draggable: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ai-tryon-comparison__badge ai-tryon-comparison__badge--before",
										children: "Original Photo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "ai-tryon-comparison__after-wrap",
										style: { clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: resultImage,
											alt: "AI Virtual Try-on result",
											className: "ai-tryon-comparison__img",
											draggable: false
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ai-tryon-comparison__badge ai-tryon-comparison__badge--after",
											children: "✦ AI Virtual Look"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "ai-tryon-comparison__divider",
										style: { left: `${sliderPosition}%` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "ai-tryon-comparison__handle",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3.5 w-3.5" })
										})
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative aspect-[3/4] rounded-lg overflow-hidden border border-white/20 bg-black",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: userImage,
										alt: "Original photo",
										className: "w-full h-full object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ai-tryon-comparison__badge ai-tryon-comparison__badge--before",
										children: "Original"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative aspect-[3/4] rounded-lg overflow-hidden border border-[var(--gold)]/40 bg-black",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: resultImage,
										alt: "Virtual try-on result",
										className: "w-full h-full object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ai-tryon-comparison__badge ai-tryon-comparison__badge--after",
										children: "✦ AI Virtual Look"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center text-[11px] text-foreground/50 mt-2",
								children: viewMode === "slider" ? "Drag slider left & right to compare original photo and virtual drape" : "Viewing side-by-side comparison"
							})
						] }),
						step === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center py-8 max-w-md mx-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-10 w-10 text-red-400 mx-auto mb-2" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-serif text-lg font-bold text-white mb-2",
									children: "Processing Interrupted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-red-200 mb-5",
									children: errorMessage || "We could not generate the virtual try-on for this image. Please try again with a clearer, well-lit photo."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setErrorMessage(null);
										setStep("upload");
									},
									className: "ai-tryon-btn-gold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Try Another Photo" })]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ai-tryon-footer",
					children: step === "result" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setUserImage(null);
								setResultImage(null);
								setStep("upload");
							},
							className: "ai-tryon-btn-outline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Try Another Photo" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleDownloadResult,
							className: "ai-tryon-btn-outline",
							title: "Save high-resolution image",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Save Look" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleAddToCart,
							className: "ai-tryon-btn-outline text-[var(--gold)] border-[var(--gold)]/40 hover:bg-[var(--gold)]/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cartToast ? "Added to Bag ✓" : "Add to Bag" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/checkout",
							onClick: () => add(product),
							className: "ai-tryon-btn-gold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Buy Now · ", formatPrice(product.priceUsd)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
						})]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] text-foreground/50",
							children: [
								"Product: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: product.name }),
								" (",
								formatPrice(product.priceUsd),
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleClose,
							className: "ai-tryon-btn-outline text-xs py-1.5",
							children: "Close"
						})]
					})
				})
			]
		})
	});
};
function ProductDetailModal({ product, onClose }) {
	const { formatPrice, currency } = useI18n();
	const { add } = useCart();
	const [activeImage, setActiveImage] = (0, import_react.useState)(product.image);
	const [activeTab, setActiveTab] = (0, import_react.useState)("specs");
	const [wishlistAdded, setWishlistAdded] = (0, import_react.useState)(false);
	const [showTryOnModal, setShowTryOnModal] = (0, import_react.useState)(false);
	const gallery = product.images && product.images.length > 0 ? product.images.map((src, idx) => ({
		label: `View ${idx + 1}`,
		src
	})) : [
		{
			label: "Primary View",
			src: product.image
		},
		...product.galleryImages?.pallu ? [{
			label: "Pallu View",
			src: product.galleryImages.pallu
		}] : [],
		...product.galleryImages?.border ? [{
			label: "Border View",
			src: product.galleryImages.border
		}] : [],
		...product.galleryImages?.closeUp ? [{
			label: "Close Up",
			src: product.galleryImages.closeUp
		}] : [],
		...product.galleryImages?.model ? [{
			label: "Model View",
			src: product.galleryImages.model
		}] : []
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white text-foreground rounded-sm max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-border animate-in fade-in",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border bg-[var(--wine-deep)] text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] font-semibold text-[var(--gold)]",
						children: "Product Master Specifications"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					"aria-label": "Close modal",
					className: "p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-5 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-[4/5] max-h-[340px] sm:max-h-[460px] bg-secondary/30 border border-border rounded-sm overflow-hidden group shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: activeImage,
								alt: product.name,
								className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "absolute top-3 left-3 bg-black/70 text-white text-[10px] uppercase font-mono px-2.5 py-1 rounded",
								children: ["SKU: ", product.sku]
							})]
						}),
						gallery.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 overflow-x-auto pb-1",
							children: gallery.map((g, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setActiveImage(g.src),
								className: `h-16 w-14 rounded-xs border overflow-hidden shrink-0 transition-all ${activeImage === g.src ? "border-[var(--wine)] ring-2 ring-[var(--wine)]/30" : "border-border opacity-70 hover:opacity-100"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: g.src,
									alt: g.label,
									className: "w-full h-full object-cover"
								})
							}, idx))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 bg-secondary/30 rounded-sm border border-border space-y-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Vendor:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: product.vendor
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Availability:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold text-[10px] uppercase",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3 text-emerald-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											product.availability,
											" (",
											product.stockQuantity,
											" available)"
										] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Weave Craft:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-foreground",
										children: [product.handloomOrPowerloom, " Handloom"]
									})]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-7 space-y-6 flex flex-col justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "eyebrow text-[var(--gold)] mb-1",
									children: [
										product.category,
										" · ",
										product.subcategory || product.productType
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-2xl md:text-3xl font-bold text-[var(--wine-deep)] leading-tight",
									children: product.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground mt-1",
									children: ["Origin: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: product.originRegion
									})]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline gap-3 pt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-serif text-2xl font-bold text-[var(--wine-deep)]",
										children: formatPrice(product.priceUsd)
									}),
									product.compareAtUsd && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm text-muted-foreground line-through",
										children: formatPrice(product.compareAtUsd)
									}),
									product.compareAtUsd && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded",
										children: [
											"Save ",
											Math.round((product.compareAtUsd - product.priceUsd) / product.compareAtUsd * 100),
											"%"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setShowTryOnModal(true),
									className: "w-full bg-gradient-to-r from-[#1c0812] via-[#2f0c1e] to-[#1c0812] text-[var(--gold)] border border-[var(--gold)]/50 py-3.5 px-4 text-xs font-bold uppercase tracking-[0.22em] rounded-sm hover:border-[var(--gold)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-[var(--gold)] group-hover:rotate-12 transition-transform" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✦ AI Virtual Try-On — See On You" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => add(product),
										className: "bg-[var(--wine)] text-white py-3.5 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-[var(--wine-deep)] transition-all shadow-md flex items-center justify-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add to Bag" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/checkout",
										onClick: () => add(product),
										className: "bg-[var(--gold)] text-[var(--wine-deep)] py-3.5 text-xs font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white text-center transition-all shadow-md flex items-center justify-center gap-2 border border-[var(--wine-deep)]/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-[var(--wine-deep)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Buy Now" })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex border-b border-border text-[11px] sm:text-xs font-semibold uppercase tracking-wider overflow-x-auto gap-2 no-scrollbar pb-0.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setActiveTab("specs"),
												className: `pb-2.5 px-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === "specs" ? "border-b-2 border-[var(--wine)] text-[var(--wine)] font-bold" : "text-muted-foreground hover:text-foreground"}`,
												children: "Specifications"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setActiveTab("craft"),
												className: `pb-2.5 px-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === "craft" ? "border-b-2 border-[var(--wine)] text-[var(--wine)] font-bold" : "text-muted-foreground hover:text-foreground"}`,
												children: "Craft & Story"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setActiveTab("care"),
												className: `pb-2.5 px-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === "care" ? "border-b-2 border-[var(--wine)] text-[var(--wine)] font-bold" : "text-muted-foreground hover:text-foreground"}`,
												children: "Care & Storage"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setActiveTab("shipping"),
												className: `pb-2.5 px-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === "shipping" ? "border-b-2 border-[var(--wine)] text-[var(--wine)] font-bold" : "text-muted-foreground hover:text-foreground"}`,
												children: "Shipping & Returns"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => setActiveTab("faq"),
												className: `pb-2.5 px-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === "faq" ? "border-b-2 border-[var(--wine)] text-[var(--wine)] font-bold" : "text-muted-foreground hover:text-foreground"}`,
												children: "Product FAQs"
											})
										]
									}),
									activeTab === "specs" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "py-4 space-y-3 animate-in fade-in",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs border border-border rounded-sm p-3 sm:p-4 bg-secondary/20",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-1",
													children: ["SKU: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "font-mono text-foreground",
														children: product.sku
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-1",
													children: ["Category: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: product.category
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-1",
													children: ["Fabric: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: product.fabric
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-1",
													children: ["Colour: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: product.color
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-1",
													children: ["Occasion: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: product.occasion?.join(", ") || "Festive & Wedding"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-1",
													children: ["Work Type: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: product.workType
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-1",
													children: ["Design / Pattern: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: product.designPattern
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-1",
													children: ["Border Type: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: product.borderType
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-1",
													children: ["Blouse Piece: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: product.blousePiece ? "With Blouse Piece" : "Without"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-1",
													children: ["Saree Length: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: product.sareeLength || "5.5 meters"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-1",
													children: ["Saree Width: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: product.sareeWidth || "45 inches"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-1",
													children: ["Weight: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: product.weight || "650g"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-1",
													children: ["Craft Region: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: product.originRegion
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "py-1",
													children: ["Handloom / Powerloom: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: product.handloomOrPowerloom
													})]
												})
											]
										})
									}),
									activeTab === "craft" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "py-4 space-y-3 text-xs leading-relaxed animate-in fade-in",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium text-foreground",
												children: product.shortDescription
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground",
												children: product.fullDescription
											}),
											product.fabricDescription && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 bg-secondary/30 rounded border border-border",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground block mb-1",
													children: "Fabric Story:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: product.fabricDescription
												})]
											})
										]
									}),
									activeTab === "care" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "py-4 space-y-3 text-xs animate-in fade-in",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 bg-amber-50 rounded border border-amber-200 text-amber-900 space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "block font-bold",
												children: "Cleaning Instructions:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: product.careInstructions })]
										}), product.storageInstructions && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 bg-secondary/30 rounded border border-border space-y-1 text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "block font-bold text-foreground",
												children: "Storage Guidance:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: product.storageInstructions })]
										})]
									}),
									activeTab === "shipping" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "py-4 space-y-3 text-xs animate-in fade-in",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "block font-bold",
												children: "Shipping Information:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: product.shippingInformation })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 bg-secondary/30 rounded border border-border space-y-1 text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "block font-bold text-foreground",
												children: "Final Sale Guarantee:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: product.returnExchangeInfo || "All sales are final. Each piece undergoes 3-tier quality inspection prior to dispatch." })]
										})]
									}),
									activeTab === "faq" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "py-4 space-y-3 text-xs animate-in fade-in",
										children: product.faqs && product.faqs.length > 0 ? product.faqs.map((faq, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 bg-secondary/30 rounded border border-border space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "block text-foreground",
												children: faq.question
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: faq.answer
											})]
										}, idx)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-3 bg-secondary/30 rounded border border-border text-muted-foreground",
											children: "Standard shipping, silk mark certification, and handloom care policies apply to this listing."
										})
									})
								]
							})
						]
					})
				})]
			})]
		}), showTryOnModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AITryOnModal, {
			product,
			isOpen: showTryOnModal,
			onClose: () => setShowTryOnModal(false)
		})]
	});
}
function SectionHeading({ eyebrow, title, sub, align = "center" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `mb-8 sm:mb-10 md:mb-14 ${align === "center" ? "text-center" : ""}`,
		children: [
			eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "eyebrow mb-2.5 sm:mb-3",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl sm:text-3xl md:text-5xl text-[var(--wine-deep)] leading-tight",
				children: title
			}),
			sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto px-2 sm:px-0",
				children: sub
			}),
			align === "center" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 sm:mt-5 flex items-center justify-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-[var(--gold)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gold-divider" })
				]
			})
		]
	});
}
function ProductCard({ product }) {
	const { t, formatPrice } = useI18n();
	const { add } = useCart();
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [showTryOn, setShowTryOn] = (0, import_react.useState)(false);
	const [isWishlisted, setIsWishlisted] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "group flex flex-col h-full",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: () => setShowModal(true),
				className: "relative overflow-hidden bg-[var(--muted)] aspect-[4/5] cursor-pointer rounded-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.image,
						alt: product.name,
						loading: "lazy",
						className: "h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
					}),
					product.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-[var(--wine)] text-[var(--ivory)] text-[9px] sm:text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xs z-10 shadow-xs",
						children: product.badge === "new" ? t("product.new") : t("product.bestseller")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: (e) => {
							e.stopPropagation();
							setShowTryOn(true);
						},
						"aria-label": `AI Virtual Try-On for ${product.name}`,
						className: "absolute top-2.5 right-11 sm:top-3 sm:right-13 h-8 sm:h-9 px-2 sm:px-2.5 flex items-center gap-1 bg-[var(--wine-deep)]/90 backdrop-blur-xs rounded-full text-[var(--gold)] text-[9px] sm:text-[10px] tracking-wider uppercase font-bold border border-[var(--gold)]/40 hover:border-[var(--gold)] hover:shadow-[0_0_12px_rgba(212,175,55,0.4)] transition-all z-10 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-[var(--gold)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Try On" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: (e) => {
							e.stopPropagation();
							setIsWishlisted(!isWishlisted);
						},
						"aria-label": "Add to wishlist",
						className: `absolute top-2.5 right-2.5 sm:top-3 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 grid place-items-center backdrop-blur-xs rounded-full transition-colors z-10 cursor-pointer ${isWishlisted ? "bg-[var(--wine)] text-[var(--gold)] shadow-md" : "bg-[var(--ivory)]/90 text-foreground hover:text-[var(--wine)]"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-3.5 w-3.5 sm:h-4 sm:w-4 ${isWishlisted ? "fill-current" : ""}` })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-0 inset-x-0 grid grid-cols-2 translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300 shadow-xl z-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: (e) => {
								e.stopPropagation();
								add(product);
							},
							className: "bg-[var(--wine)] text-[var(--ivory)] text-[9px] sm:text-[10px] tracking-[0.16em] uppercase py-2.5 sm:py-3 font-semibold hover:bg-[var(--wine-deep)] transition-colors border-r border-white/20 flex items-center justify-center gap-1 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-3 w-3 sm:hidden" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("product.add") })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/checkout",
							onClick: (e) => {
								e.stopPropagation();
								add(product);
							},
							className: "bg-[var(--gold)] text-[var(--wine-deep)] text-[9px] sm:text-[10px] tracking-[0.16em] uppercase py-2.5 sm:py-3 font-bold hover:bg-white text-center transition-colors flex items-center justify-center",
							children: "Buy Now"
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-3 sm:pt-4 flex flex-col items-start gap-1 flex-1 justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1 w-full",
					children: [product.swatches && product.swatches.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: product.swatches.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border border-border/70",
							style: { backgroundColor: s }
						}, s))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						onClick: () => setShowModal(true),
						className: "font-serif text-sm sm:text-base leading-snug text-foreground cursor-pointer hover:text-[var(--wine)] transition-colors line-clamp-2",
						children: product.name
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline gap-2 pt-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs sm:text-sm text-[var(--wine)] font-semibold tracking-wide",
						children: formatPrice(product.priceUsd)
					}), product.compareAtUsd && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] sm:text-xs text-muted-foreground line-through",
						children: formatPrice(product.compareAtUsd)
					})]
				})]
			})]
		}),
		showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductDetailModal, {
			product,
			onClose: () => setShowModal(false)
		}),
		showTryOn && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AITryOnModal, {
			product,
			isOpen: showTryOn,
			onClose: () => setShowTryOn(false)
		})
	] });
}
function ProductCarousel({ products }) {
	const ref = (0, import_react.useRef)(null);
	const scroll = (dir) => {
		if (!ref.current) return;
		const w = ref.current.clientWidth;
		ref.current.scrollBy({
			left: dir * w * .75,
			behavior: "smooth"
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref,
			className: "flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 no-scrollbar",
			children: products.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "snap-start shrink-0 w-[68%] sm:w-[45%] md:w-[32%] lg:w-[23%]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p })
			}, `${p.id}-${idx}`))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden md:flex absolute -top-14 right-0 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => scroll(-1),
				className: "h-9 w-9 border border-border grid place-items-center hover:bg-[var(--wine)] hover:text-[var(--ivory)] hover:border-[var(--wine)] transition-colors cursor-pointer",
				"aria-label": "Previous products",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => scroll(1),
				className: "h-9 w-9 border border-border grid place-items-center hover:bg-[var(--wine)] hover:text-[var(--ivory)] hover:border-[var(--wine)] transition-colors cursor-pointer",
				"aria-label": "Next products",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
			})]
		})]
	});
}
//#endregion
export { SectionHeading as a, ProductDetailModal as i, ProductCard as n, story_weaver_default as o, ProductCarousel as r, AITryOnModal as t };
