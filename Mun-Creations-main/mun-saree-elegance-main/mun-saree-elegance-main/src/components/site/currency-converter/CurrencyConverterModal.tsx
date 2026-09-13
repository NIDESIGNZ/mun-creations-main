import { useEffect, useState, createContext, useContext, type ReactNode } from "react";
import { X, Sparkles, HelpCircle } from "lucide-react";
import { CurrencyConverter } from "./CurrencyConverter";

interface CurrencyConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFrom?: string;
  initialTo?: string;
  initialAmount?: number;
}

export function CurrencyConverterModal({
  isOpen,
  onClose,
  initialFrom,
  initialTo,
  initialAmount,
}: CurrencyConverterModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // Lock body scroll while open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="currency-converter-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[var(--wine-deep)] border border-[var(--gold)]/40 shadow-[0_25px_70px_rgba(0,0,0,0.85)] text-white animate-in zoom-in-95 duration-200">
        {/* Top Control Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[var(--wine-deep)]/95 backdrop-blur-md border-b border-[var(--gold)]/20">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--gold)]" />
            <span
              id="currency-converter-title"
              className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--gold)]"
            >
              Mun Creations Currency Calculator
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close currency converter modal"
            className="rounded-full p-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          <CurrencyConverter
            initialFrom={initialFrom}
            initialTo={initialTo}
            initialAmount={initialAmount}
            className="border-0 shadow-none p-0 bg-transparent"
          />

          {/* Saree Shopping Notes / FAQ */}
          <div className="mt-8 pt-6 border-t border-white/15 text-xs text-white/70 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <HelpCircle className="h-4 w-4 text-[var(--gold)]" />
              <span>International Shopping & Currency Conversion Notes</span>
            </div>
            <p className="leading-relaxed">
              • All our artisan sarees are woven in India and priced with real-time conversion
              rates. We accept international debit/credit cards, PayPal, and Apple Pay/Google Pay
              via secure checkout.
            </p>
            <p className="leading-relaxed">
              • Orders above $500 USD (or equivalent in your currency) qualify for complimentary
              insured worldwide express shipping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Global Context for Currency Converter Modal
interface CurrencyModalContextType {
  openConverter: (options?: { from?: string; to?: string; amount?: number }) => void;
  closeConverter: () => void;
  isOpen: boolean;
}

const CurrencyModalContext = createContext<CurrencyModalContextType | null>(null);

export function CurrencyModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<{
    from?: string;
    to?: string;
    amount?: number;
  }>({});

  const openConverter = (options?: { from?: string; to?: string; amount?: number }) => {
    if (options) setModalOptions(options);
    setIsOpen(true);
  };

  const closeConverter = () => {
    setIsOpen(false);
  };

  return (
    <CurrencyModalContext.Provider value={{ openConverter, closeConverter, isOpen }}>
      {children}
      <CurrencyConverterModal
        isOpen={isOpen}
        onClose={closeConverter}
        initialFrom={modalOptions.from}
        initialTo={modalOptions.to}
        initialAmount={modalOptions.amount}
      />
    </CurrencyModalContext.Provider>
  );
}

export function useCurrencyModal() {
  const ctx = useContext(CurrencyModalContext);
  if (!ctx) {
    // Return safe fallback functions if used outside provider
    return {
      openConverter: () => {},
      closeConverter: () => {},
      isOpen: false,
    };
  }
  return ctx;
}
