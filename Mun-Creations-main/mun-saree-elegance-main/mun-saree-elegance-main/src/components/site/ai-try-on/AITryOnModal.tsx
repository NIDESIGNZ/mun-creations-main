import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  X,
  UploadCloud,
  Camera,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  Download,
  ShieldCheck,
  AlertCircle,
  Check,
  SwitchCamera,
  Info,
  SlidersHorizontal,
  UserCheck,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import {
  type Product,
  catSilk,
  catBridal,
  catCotton,
  storyWeaver,
} from "@/lib/products";
import {
  type TryOnStep,
  validateTryOnImage,
  getCategoryGuidance,
  submitTryOnRequest,
  trackTryOnEvent,
} from "@/lib/ai-try-on";
import "./AITryOnModal.css";

export interface AITryOnModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_MODELS = [
  { id: "m1", label: "Standing Saree Silhouette", image: catBridal },
  { id: "m2", label: "Silk Drape Portrait", image: catSilk },
  { id: "m3", label: "Natural Cotton Pose", image: catCotton },
  { id: "m4", label: "Artisan Weave Pose", image: storyWeaver },
];

export const AITryOnModal: React.FC<AITryOnModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { formatPrice } = useI18n();
  const { add } = useCart();

  // Modal Step & Mode State
  const [step, setStep] = useState<TryOnStep>("upload");
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [selectedVariant, setSelectedVariant] = useState<string>(product.color || "Standard");

  // User Images
  const [userImage, setUserImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Camera State
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [isStartingCamera, setIsStartingCamera] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Processing Animation State
  const [processingStage, setProcessingStage] = useState<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Before/After Slider Position (0 to 100)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"slider" | "side-by-side">("slider");
  const comparisonContainerRef = useRef<HTMLDivElement | null>(null);

  // Toast notification for Add to Cart
  const [cartToast, setCartToast] = useState<boolean>(false);

  const guidance = getCategoryGuidance(product.category, product.subcategory);

  // Track modal open event
  useEffect(() => {
    if (isOpen) {
      trackTryOnEvent("ai_tryon_opened", { productId: product.id, productName: product.name });
    }
  }, [isOpen, product]);

  // Clean up camera streams when leaving camera mode or closing modal
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsStartingCamera(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCameraStream();
      abortControllerRef.current?.abort();
    };
  }, [stopCameraStream]);

  // Robust Camera Stream Binder to <video> DOM
  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((e) => {
        console.warn("Video autoplay blocked or pending interaction:", e);
      });
    }
  }, [cameraActive, mode]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    stopCameraStream();
    abortControllerRef.current?.abort();
    onClose();
  };

  // Start Camera
  const startCamera = async (facing: "user" | "environment" = facingMode) => {
    stopCameraStream();
    setCameraError(null);
    setIsStartingCamera(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera is not supported on this browser or connection is not HTTPS.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraActive(true);
      setIsStartingCamera(false);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn("Camera start error:", err);
      setIsStartingCamera(false);
      setCameraActive(false);
      setCameraError(
        err.name === "NotAllowedError" || err.name === "PermissionDeniedError"
          ? "Camera permission was not granted. You can easily upload a photo or choose a sample model below."
          : "Unable to connect to camera device. Please use the Upload Photo option."
      );
    }
  };

  // Switch between Front & Rear Camera
  const handleSwitchCamera = () => {
    const nextFacing = facingMode === "user" ? "environment" : "user";
    setFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  // Capture Photo from Camera
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
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

      stopCameraStream();
      setUserImage(dataUrl);
      setStep("preview");
      trackTryOnEvent("ai_tryon_photo_uploaded", { source: "camera", productId: product.id });
    }
  };

  // Handle File Input Selection
  const handleFileSelect = (file: File) => {
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
        trackTryOnEvent("ai_tryon_photo_uploaded", { source: "file_upload", productId: product.id });
      }
    };
    reader.onerror = () => {
      setErrorMessage("Could not read image file. Please try another photo.");
    };
    reader.readAsDataURL(file);
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle Selection of Sample Model Preset
  const handleSelectSampleModel = (modelImage: string) => {
    stopCameraStream();
    setUserImage(modelImage);
    setStep("preview");
    trackTryOnEvent("ai_tryon_photo_uploaded", { source: "sample_model", productId: product.id });
  };

  // Start AI Virtual Try-On Generation
  const handleGenerateTryOn = async () => {
    if (!userImage) return;

    setStep("processing");
    setProcessingStage(0);
    setErrorMessage(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Multi-stage animated status progression
    const stageInterval = setInterval(() => {
      setProcessingStage((prev) => (prev < 3 ? prev + 1 : prev));
    }, 750);

    try {
      trackTryOnEvent("ai_tryon_started", { productId: product.id, productName: product.name });

      const response = await submitTryOnRequest(
        {
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
            priceUsd: product.priceUsd,
          },
        },
        controller.signal
      );

      clearInterval(stageInterval);

      if (response.success && response.resultImageUrl) {
        setResultImage(response.resultImageUrl);
        setStep("result");
        trackTryOnEvent("ai_tryon_completed", { productId: product.id, durationMs: response.processingTimeMs });
      } else {
        throw new Error(response.error || "Unable to generate virtual try-on at this time.");
      }
    } catch (err: any) {
      clearInterval(stageInterval);
      if (err.name === "AbortError") {
        setStep("preview");
        return;
      }
      setErrorMessage(err.message || "An unexpected error occurred during processing.");
      setStep("error");
      trackTryOnEvent("ai_tryon_failed", { productId: product.id, error: err.message });
    }
  };

  // Cancel in-flight AI Generation
  const handleCancelProcessing = () => {
    abortControllerRef.current?.abort();
    setStep("preview");
  };

  // Slider Mouse & Touch Interaction
  const handleSliderMove = useCallback((clientX: number) => {
    if (!comparisonContainerRef.current) return;
    const rect = comparisonContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDraggingSlider(true);
    handleSliderMove(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDraggingSlider) {
      handleSliderMove(e.clientX);
    }
  };

  const handlePointerUp = () => {
    setIsDraggingSlider(false);
  };

  // Add to Cart handler
  const handleAddToCart = () => {
    add(product);
    setCartToast(true);
    trackTryOnEvent("ai_tryon_product_added_to_cart", { productId: product.id });
    setTimeout(() => setCartToast(false), 2500);
  };

  // Download high-resolution look
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
    "Finalizing your personalized high-res look...",
  ];

  return (
    <div
      className="ai-tryon-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-tryon-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="ai-tryon-modal">
        {/* Header */}
        <div className="ai-tryon-header">
          <div className="ai-tryon-header__title-group">
            <div className="ai-tryon-header__icon-badge">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 id="ai-tryon-title" className="ai-tryon-header__title">
                AI Virtual Try-On
              </h2>
              <p className="ai-tryon-header__subtitle">
                See how <strong>{product.name}</strong> drapes on you
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close AI Try-On modal"
            className="ai-tryon-header__close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="ai-tryon-steps" role="navigation" aria-label="Try-On progress">
          <div
            className={`ai-tryon-step ${
              step === "upload" ? "is-active" : step !== "error" ? "is-completed" : ""
            }`}
          >
            <span className="ai-tryon-step__circle">
              {step !== "upload" && step !== "error" ? <Check className="h-3 w-3" /> : "1"}
            </span>
            <span>Select Photo</span>
          </div>
          <span className={`ai-tryon-step__line ${step !== "upload" ? "is-active" : ""}`} />

          <div
            className={`ai-tryon-step ${
              step === "preview" ? "is-active" : step === "processing" || step === "result" ? "is-completed" : ""
            }`}
          >
            <span className="ai-tryon-step__circle">
              {step === "processing" || step === "result" ? <Check className="h-3 w-3" /> : "2"}
            </span>
            <span>Confirm & Pose</span>
          </div>
          <span className={`ai-tryon-step__line ${step === "processing" || step === "result" ? "is-active" : ""}`} />

          <div
            className={`ai-tryon-step ${
              step === "processing" ? "is-active" : step === "result" ? "is-completed" : ""
            }`}
          >
            <span className="ai-tryon-step__circle">
              {step === "result" ? <Check className="h-3 w-3" /> : "3"}
            </span>
            <span>AI Synthesis</span>
          </div>
          <span className={`ai-tryon-step__line ${step === "result" ? "is-active" : ""}`} />

          <div className={`ai-tryon-step ${step === "result" ? "is-active" : ""}`}>
            <span className="ai-tryon-step__circle">4</span>
            <span>Virtual Look</span>
          </div>
        </div>

        {/* Body Content by Step */}
        <div className="ai-tryon-body">
          {/* STEP 1: Upload or Camera */}
          {step === "upload" && (
            <div>
              {/* Mode Toggle */}
              <div className="text-center">
                <div className="ai-tryon-mode-toggle">
                  <button
                    type="button"
                    className={`ai-tryon-mode-btn ${mode === "upload" ? "is-active" : ""}`}
                    onClick={() => {
                      setMode("upload");
                      stopCameraStream();
                    }}
                  >
                    <UploadCloud className="h-4 w-4" />
                    <span>Upload Photo</span>
                  </button>
                  <button
                    type="button"
                    className={`ai-tryon-mode-btn ${mode === "camera" ? "is-active" : ""}`}
                    onClick={() => {
                      setMode("camera");
                      startCamera();
                    }}
                  >
                    <Camera className="h-4 w-4" />
                    <span>Take Photo (Camera)</span>
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              {mode === "upload" && (
                <div>
                  <div
                    className={`ai-tryon-dropzone ${isDragOver ? "is-dragover" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("ai-tryon-file-input")?.click()}
                  >
                    <input
                      id="ai-tryon-file-input"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="ai-tryon-dropzone__icon-wrap">
                      <UploadCloud className="h-7 w-7" />
                    </div>
                    <h3 className="font-serif text-base md:text-lg font-bold text-white mb-1">
                      Choose a photo or drag & drop here
                    </h3>
                    <p className="text-xs text-foreground/60 mb-3">
                      Supports JPG, PNG, WEBP up to 10MB
                    </p>
                    <span className="ai-tryon-btn-gold">Browse Files</span>
                  </div>

                  {errorMessage && (
                    <div className="mt-3 p-3 bg-red-950/60 border border-red-500/40 rounded text-xs text-red-200 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Camera Stream View */}
              {mode === "camera" && (
                <div>
                  {cameraError ? (
                    <div className="text-center py-6 p-4 bg-red-950/30 border border-red-500/30 rounded-lg max-w-md mx-auto">
                      <AlertCircle className="h-7 w-7 text-red-400 mx-auto mb-2" />
                      <p className="text-xs text-red-200 mb-4">{cameraError}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("upload");
                          stopCameraStream();
                        }}
                        className="ai-tryon-btn-gold text-xs"
                      >
                        <UploadCloud className="h-3.5 w-3.5" />
                        <span>Switch to Upload Photo</span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between max-w-[420px] mx-auto mb-2 text-xs">
                        <span className="text-[var(--gold)] font-bold flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                          Live Camera
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setMode("upload");
                            stopCameraStream();
                          }}
                          className="text-foreground/70 hover:text-white flex items-center gap-1"
                        >
                          <ArrowLeft className="h-3 w-3" />
                          <span>Back to Upload</span>
                        </button>
                      </div>

                      <div className="ai-tryon-camera-view">
                        {isStartingCamera && (
                          <div className="ai-tryon-camera-loading">
                            <Loader2 className="h-6 w-6 animate-spin text-[var(--gold)]" />
                            <span>Connecting to camera...</span>
                          </div>
                        )}

                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          onLoadedMetadata={(e) => {
                            (e.target as HTMLVideoElement).play().catch(() => {});
                          }}
                          className="ai-tryon-camera-video"
                          style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
                        />

                        {cameraActive && (
                          <div className="ai-tryon-camera-controls">
                            <button
                              type="button"
                              onClick={handleSwitchCamera}
                              className="ai-tryon-camera-switch-btn"
                              title="Flip front/rear camera"
                              aria-label="Flip front/rear camera"
                            >
                              <SwitchCamera className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={handleCaptureSnapshot}
                              className="ai-tryon-camera-snap-btn"
                              title="Take snapshot"
                              aria-label="Take snapshot"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sample Model Presets (1-Click Instant Try-On) */}
              <div className="ai-tryon-presets">
                <div className="ai-tryon-presets__header">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-[var(--gold)]" />
                    <span>Or try instantly with a sample model pose:</span>
                  </span>
                  <span className="text-[10px] text-foreground/45 normal-case">
                    Click any model to preview
                  </span>
                </div>
                <div className="ai-tryon-presets__grid">
                  {SAMPLE_MODELS.map((model) => (
                    <div
                      key={model.id}
                      className="ai-tryon-preset-card group"
                      onClick={() => handleSelectSampleModel(model.image)}
                      title={`Try with ${model.label}`}
                    >
                      <img src={model.image} alt={model.label} loading="lazy" />
                      <div className="ai-tryon-preset-card__label">
                        {model.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category-Specific Guidance Box */}
              <div className="ai-tryon-guidance">
                <div className="ai-tryon-guidance__title">
                  <Info className="h-3.5 w-3.5" />
                  <span>Recommended for {product.category}: {guidance.headline}</span>
                </div>
                <ul className="ai-tryon-guidance__list">
                  {guidance.tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* STEP 2: Preview & Pose Confirmation */}
          {step === "preview" && userImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative aspect-[3/4] max-w-xs mx-auto w-full rounded-lg overflow-hidden border border-[var(--gold)]/30 bg-black">
                <img
                  src={userImage}
                  alt="Your selected photo preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-black/75 backdrop-blur text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded text-white border border-white/20">
                  Your Photo
                </span>
              </div>

              <div className="space-y-4">
                <div className="p-3.5 bg-[var(--gold)]/10 border border-[var(--gold)]/25 rounded-lg">
                  <div className="flex items-center gap-2 text-xs uppercase font-bold text-[var(--gold)] mb-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Selected Drape Context</span>
                  </div>
                  <h4 className="font-serif text-base md:text-lg font-bold text-white mb-1">
                    {product.name}
                  </h4>
                  <div className="text-xs text-foreground/75 flex flex-wrap gap-x-3 gap-y-1">
                    <span>Fabric: <strong>{product.fabric || "Silk"}</strong></span>
                    <span>Weave: <strong>{product.weave || "Handloom"}</strong></span>
                    <span>Price: <strong className="text-[var(--gold)]">{formatPrice(product.priceUsd)}</strong></span>
                  </div>
                </div>

                {/* Swatch / Variant Selection */}
                {product.swatches && product.swatches.length > 0 && (
                  <div>
                    <label className="text-xs uppercase tracking-wider text-foreground/60 block mb-1.5 font-semibold">
                      Select Variant / Color Tone:
                    </label>
                    <div className="flex items-center gap-2">
                      {product.swatches.map((colorHex, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedVariant(colorHex)}
                          className={`h-7 w-7 rounded-full border-2 transition-transform ${
                            selectedVariant === colorHex
                              ? "scale-110 border-white shadow-[0_0_10px_rgba(212,175,55,0.7)]"
                              : "border-transparent opacity-80 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: colorHex }}
                          title={colorHex}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Privacy & Consent Notice */}
                <div className="p-3 bg-black/40 border border-white/10 rounded text-[11px] text-foreground/65 flex items-start gap-2 leading-relaxed">
                  <ShieldCheck className="h-4 w-4 text-[var(--gold)] shrink-0 mt-0.5" />
                  <span>
                    <strong>Privacy Guarantee:</strong> Your photograph is processed in real time
                    for virtual draping visualization and is discarded after your session.
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setUserImage(null);
                      setStep("upload");
                    }}
                    className="ai-tryon-btn-outline"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Retake / Change Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateTryOn}
                    className="ai-tryon-btn-gold flex-1 justify-center"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Virtual Look ✦</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Processing Animation */}
          {step === "processing" && (
            <div className="ai-tryon-processing-container">
              <div className="ai-tryon-spinner-ring">
                <div className="ai-tryon-spinner-ring__outer" />
                <div className="ai-tryon-spinner-ring__inner" />
                <div className="ai-tryon-spinner-ring__icon">
                  <Sparkles className="h-8 w-8 animate-pulse text-[var(--gold)]" />
                </div>
              </div>

              <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-2">
                Weaving Your Virtual Drape...
              </h3>
              <p className="text-sm text-[var(--gold)] font-medium max-w-md mb-5 animate-fade-in">
                {processingStages[processingStage]}
              </p>

              <div className="w-full max-w-xs bg-white/10 h-1.5 rounded-full overflow-hidden mb-6">
                <div
                  className="bg-[var(--gold)] h-full transition-all duration-700 ease-out"
                  style={{ width: `${(processingStage + 1) * 25}%` }}
                />
              </div>

              <button
                type="button"
                onClick={handleCancelProcessing}
                className="ai-tryon-btn-outline text-xs"
              >
                Cancel Request
              </button>
            </div>
          )}

          {/* STEP 4: Result & Comparison Workspace */}
          {step === "result" && resultImage && userImage && (
            <div>
              {/* Controls Bar: Mode Toggle + Reset */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="text-xs uppercase font-bold text-[var(--gold)] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Personalized Virtual Try-On Result</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode(viewMode === "slider" ? "side-by-side" : "slider")}
                    className="ai-tryon-btn-outline text-[11px] py-1 px-2.5"
                  >
                    <SlidersHorizontal className="h-3 w-3" />
                    <span>{viewMode === "slider" ? "Side-by-Side View" : "Split Slider"}</span>
                  </button>
                </div>
              </div>

              {/* Slider View Mode */}
              {viewMode === "slider" ? (
                <div
                  ref={comparisonContainerRef}
                  className="ai-tryon-comparison"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                >
                  {/* Before (Original Image) */}
                  <img
                    src={userImage}
                    alt="Original user photo"
                    className="ai-tryon-comparison__img"
                    draggable={false}
                  />
                  <span className="ai-tryon-comparison__badge ai-tryon-comparison__badge--before">
                    Original Photo
                  </span>

                  {/* After (Try-On Result Image clipped) */}
                  <div
                    className="ai-tryon-comparison__after-wrap"
                    style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
                  >
                    <img
                      src={resultImage}
                      alt="AI Virtual Try-on result"
                      className="ai-tryon-comparison__img"
                      draggable={false}
                    />
                    <span className="ai-tryon-comparison__badge ai-tryon-comparison__badge--after">
                      ✦ AI Virtual Look
                    </span>
                  </div>

                  {/* Draggable Divider Line */}
                  <div
                    className="ai-tryon-comparison__divider"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="ai-tryon-comparison__handle">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              ) : (
                /* Side-by-Side View Mode */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/20 bg-black">
                    <img
                      src={userImage}
                      alt="Original photo"
                      className="w-full h-full object-cover"
                    />
                    <span className="ai-tryon-comparison__badge ai-tryon-comparison__badge--before">
                      Original
                    </span>
                  </div>
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-[var(--gold)]/40 bg-black">
                    <img
                      src={resultImage}
                      alt="Virtual try-on result"
                      className="w-full h-full object-cover"
                    />
                    <span className="ai-tryon-comparison__badge ai-tryon-comparison__badge--after">
                      ✦ AI Virtual Look
                    </span>
                  </div>
                </div>
              )}

              {/* Slider Hint */}
              <p className="text-center text-[11px] text-foreground/50 mt-2">
                {viewMode === "slider"
                  ? "Drag slider left & right to compare original photo and virtual drape"
                  : "Viewing side-by-side comparison"}
              </p>
            </div>
          )}

          {/* ERROR STATE */}
          {step === "error" && (
            <div className="text-center py-8 max-w-md mx-auto">
              <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-2" />
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                Processing Interrupted
              </h3>
              <p className="text-xs text-red-200 mb-5">
                {errorMessage || "We could not generate the virtual try-on for this image. Please try again with a clearer, well-lit photo."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setStep("upload");
                }}
                className="ai-tryon-btn-gold"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Try Another Photo</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="ai-tryon-footer">
          {step === "result" ? (
            <>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUserImage(null);
                    setResultImage(null);
                    setStep("upload");
                  }}
                  className="ai-tryon-btn-outline"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Try Another Photo</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadResult}
                  className="ai-tryon-btn-outline"
                  title="Save high-resolution image"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Save Look</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="ai-tryon-btn-outline text-[var(--gold)] border-[var(--gold)]/40 hover:bg-[var(--gold)]/20"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>{cartToast ? "Added to Bag ✓" : "Add to Bag"}</span>
                </button>

                <Link
                  to="/checkout"
                  onClick={() => add(product)}
                  className="ai-tryon-btn-gold"
                >
                  <span>Buy Now · {formatPrice(product.priceUsd)}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <span className="text-[11px] text-foreground/50">
                Product: <strong>{product.name}</strong> ({formatPrice(product.priceUsd)})
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="ai-tryon-btn-outline text-xs py-1.5"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITryOnModal;
