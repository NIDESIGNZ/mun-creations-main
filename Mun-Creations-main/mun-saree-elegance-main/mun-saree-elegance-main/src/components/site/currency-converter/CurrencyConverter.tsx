import { useState, useEffect, useId } from "react";
import {
  ArrowRightLeft,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info,
} from "lucide-react";
import {
  CURRENCY_METADATA_LIST,
  CURRENCY_MAP,
  POPULAR_CURRENCIES,
  type CurrencyMeta,
} from "@/lib/currency/currencies";
import { convertLiveCurrency, type LiveConversionResult } from "@/services/currencyService";

interface CurrencyConverterProps {
  initialFrom?: string;
  initialTo?: string;
  initialAmount?: number;
  className?: string;
  compact?: boolean;
  onConversionComplete?: (result: LiveConversionResult) => void;
}

export function CurrencyConverter({
  initialFrom = "USD",
  initialTo = "INR",
  initialAmount = 100,
  className = "",
  compact = false,
  onConversionComplete,
}: CurrencyConverterProps) {
  const [amount, setAmount] = useState<string>(String(initialAmount));
  const [from, setFrom] = useState<string>(initialFrom.toUpperCase());
  const [to, setTo] = useState<string>(initialTo.toUpperCase());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<LiveConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  const amountInputId = useId();
  const fromSelectId = useId();
  const toSelectId = useId();

  // Execute initial conversion on mount
  useEffect(() => {
    handleConvert(Number(amount) || 100, from, to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConvert = async (customAmount?: number, customFrom?: string, customTo?: string) => {
    const num = customAmount !== undefined ? customAmount : Number(amount);
    const fromCode = (customFrom || from).trim().toUpperCase();
    const toCode = (customTo || to).trim().toUpperCase();

    if (isNaN(num) || num <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await convertLiveCurrency(fromCode, toCode, num);
      if (res.success) {
        setResult(res);
        if (onConversionComplete) onConversionComplete(res);
      } else {
        setError(res.error || "Could not retrieve live exchange rates. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred while converting.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = () => {
    setIsSwapping(true);
    const newFrom = to;
    const newTo = from;
    setFrom(newFrom);
    setTo(newTo);

    setTimeout(() => {
      setIsSwapping(false);
      handleConvert(Number(amount) || 1, newFrom, newTo);
    }, 200);
  };

  const handleQuickPair = (pairFrom: string, pairTo: string) => {
    setFrom(pairFrom);
    setTo(pairTo);
    handleConvert(Number(amount) || 100, pairFrom, pairTo);
  };

  const handleAmountPreset = (preset: number) => {
    setAmount(String(preset));
    handleConvert(preset, from, to);
  };

  const fromMeta: CurrencyMeta = CURRENCY_MAP[from] || {
    code: from,
    symbol: from,
    name: from,
    country: "",
    flag: "🌐",
    decimalPlaces: 2,
  };

  const toMeta: CurrencyMeta = CURRENCY_MAP[to] || {
    code: to,
    symbol: to,
    name: to,
    country: "",
    flag: "🌐",
    decimalPlaces: 2,
  };

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  return (
    <div
      className={`rounded-2xl border border-[var(--gold)]/30 bg-[var(--wine-deep)] text-white shadow-2xl p-5 sm:p-7 md:p-8 backdrop-blur-xl ${className}`}
    >
      {/* Header Title */}
      {!compact && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--gold)]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[var(--gold)]/15 border border-[var(--gold)]/40 flex items-center justify-center text-[var(--gold)]">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-medium tracking-wide text-white flex items-center gap-2">
                <span>Live Currency Converter</span>
                <Sparkles className="h-4 w-4 text-[var(--gold)] animate-pulse" />
              </h3>
              <p className="text-xs text-white/70">
                Real-time official conversion rates powered by ExchangeRate-API
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--gold)] bg-[var(--gold)]/10 px-3 py-1.5 rounded-full border border-[var(--gold)]/20 self-start sm:self-auto">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Direct Live API</span>
          </div>
        </div>
      )}

      {/* Main Converter Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleConvert();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Amount Input */}
          <div className="md:col-span-4 space-y-1.5">
            <label
              htmlFor={amountInputId}
              className="text-xs font-semibold tracking-wider uppercase text-white/80 flex items-center justify-between"
            >
              <span>Amount</span>
              <span className="text-[10px] text-[var(--gold)] font-mono">{fromMeta.symbol}</span>
            </label>
            <div className="relative rounded-lg border border-white/20 bg-black/30 focus-within:border-[var(--gold)] focus-within:ring-1 focus-within:ring-[var(--gold)] transition-all">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[var(--gold)] font-semibold pointer-events-none">
                {fromMeta.symbol}
              </span>
              <input
                id={amountInputId}
                type="number"
                min="0.01"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                className="w-full bg-transparent pl-9 pr-4 py-3 text-sm text-white placeholder-white/30 focus:outline-hidden font-medium"
                required
              />
            </div>
          </div>

          {/* From Currency Select */}
          <div className="md:col-span-3 space-y-1.5">
            <label
              htmlFor={fromSelectId}
              className="text-xs font-semibold tracking-wider uppercase text-white/80"
            >
              From Currency
            </label>
            <div className="relative rounded-lg border border-white/20 bg-black/30 focus-within:border-[var(--gold)] focus-within:ring-1 focus-within:ring-[var(--gold)] transition-all">
              <select
                id={fromSelectId}
                value={from}
                onChange={(e) => {
                  const newFrom = e.target.value;
                  setFrom(newFrom);
                  handleConvert(Number(amount) || 1, newFrom, to);
                }}
                className="w-full bg-transparent px-3.5 py-3 text-sm text-white focus:outline-hidden appearance-none cursor-pointer pr-8 font-medium"
              >
                {CURRENCY_METADATA_LIST.map((c) => (
                  <option
                    key={`from-${c.code}`}
                    value={c.code}
                    className="bg-[var(--wine-deep)] text-white py-1"
                  >
                    {c.flag} {c.code} — {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50">
                ▼
              </span>
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-2 flex justify-center pb-0.5">
            <button
              type="button"
              onClick={handleSwap}
              disabled={isLoading}
              title="Swap From and To currencies"
              aria-label="Swap Currencies"
              className="w-full md:w-12 h-11 rounded-lg border border-[var(--gold)]/40 bg-[var(--gold)]/10 hover:bg-[var(--gold)]/25 text-[var(--gold)] flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <ArrowRightLeft
                className={`h-4 w-4 transition-transform duration-300 ${
                  isSwapping ? "rotate-180 scale-125" : ""
                }`}
              />
            </button>
          </div>

          {/* To Currency Select */}
          <div className="md:col-span-3 space-y-1.5">
            <label
              htmlFor={toSelectId}
              className="text-xs font-semibold tracking-wider uppercase text-white/80"
            >
              To Currency
            </label>
            <div className="relative rounded-lg border border-white/20 bg-black/30 focus-within:border-[var(--gold)] focus-within:ring-1 focus-within:ring-[var(--gold)] transition-all">
              <select
                id={toSelectId}
                value={to}
                onChange={(e) => {
                  const newTo = e.target.value;
                  setTo(newTo);
                  handleConvert(Number(amount) || 1, from, newTo);
                }}
                className="w-full bg-transparent px-3.5 py-3 text-sm text-white focus:outline-hidden appearance-none cursor-pointer pr-8 font-medium"
              >
                {CURRENCY_METADATA_LIST.map((c) => (
                  <option
                    key={`to-${c.code}`}
                    value={c.code}
                    className="bg-[var(--wine-deep)] text-white py-1"
                  >
                    {c.flag} {c.code} — {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50">
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* Quick Amount Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] uppercase tracking-wider text-white/60 font-semibold mr-1">
            Quick Amounts:
          </span>
          {[50, 100, 250, 500, 1000, 5000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleAmountPreset(preset)}
              className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                Number(amount) === preset
                  ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--wine-deep)] font-bold shadow-sm"
                  : "border-white/15 bg-white/5 text-white/80 hover:border-[var(--gold)]/60 hover:text-white"
              }`}
            >
              {fromMeta.symbol} {preset}
            </button>
          ))}
        </div>

        {/* Convert Action Button */}
        <div className="pt-2 flex items-center justify-between gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 sm:flex-none sm:min-w-[200px] flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[var(--gold)] hover:bg-[var(--gold)]/90 text-[var(--wine-deep)] font-semibold text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Converting...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span>Convert Live</span>
              </>
            )}
          </button>

          {result && !error && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-white/60">
              <Info className="h-3.5 w-3.5 text-[var(--gold)]" />
              <span>
                1 {from} = {formatNumber(result.rate, toMeta.decimalPlaces > 0 ? 4 : 2)} {to}
              </span>
            </div>
          )}
        </div>
      </form>

      {/* Error Message Display */}
      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 flex items-start gap-3 animate-in fade-in duration-300">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs sm:text-sm">
            <p className="font-semibold text-red-300">Conversion Error</p>
            <p className="mt-0.5">{error}</p>
            <button
              type="button"
              onClick={() => handleConvert()}
              className="mt-2 text-xs text-white underline hover:text-[var(--gold)]"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Live Conversion Result Card */}
      {result && !error && (
        <div className="mt-6 rounded-xl border border-[var(--gold)]/40 bg-gradient-to-br from-black/40 to-black/20 p-5 sm:p-6 shadow-inner animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-white/70 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <span>{fromMeta.flag}</span>
                <span>
                  {formatNumber(result.amount, fromMeta.decimalPlaces)} {result.from} =
                </span>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[var(--gold)] mt-1 tracking-tight">
                {toMeta.symbol} {formatNumber(result.convertedAmount, toMeta.decimalPlaces)}{" "}
                <span className="text-lg sm:text-xl font-sans font-medium text-white/90">
                  {result.to}
                </span>
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0 space-y-1">
              <div className="text-xs text-white/80 font-mono">
                1 {result.from} = {formatNumber(result.rate, toMeta.decimalPlaces > 0 ? 4 : 2)}{" "}
                {result.to}
              </div>
              {result.rate > 0 && (
                <div className="text-xs text-white/60 font-mono">
                  1 {result.to} ={" "}
                  {formatNumber(1 / result.rate, fromMeta.decimalPlaces > 0 ? 4 : 2)} {result.from}
                </div>
              )}
              <div className="text-[10px] text-white/50 pt-1">
                Rates updated:{" "}
                {new Date(result.lastUpdated).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                {result.isCached ? "(Cached)" : "(Live)"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popular Currency Pairs Quick-Select */}
      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="text-xs uppercase tracking-wider text-white/70 font-semibold mb-3 flex items-center justify-between">
          <span>Popular Saree Shopper Pairs</span>
          <span className="text-[10px] text-[var(--gold)]">Click to Convert</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {POPULAR_CURRENCIES.filter((c) => c !== "INR").map((cur) => (
            <button
              key={`pair-${cur}-INR`}
              type="button"
              onClick={() => handleQuickPair(cur, "INR")}
              className={`p-2 rounded-lg border text-xs transition-all text-center cursor-pointer ${
                from === cur && to === "INR"
                  ? "border-[var(--gold)] bg-[var(--gold)]/20 text-[var(--gold)] font-bold shadow-xs"
                  : "border-white/10 bg-white/5 hover:border-[var(--gold)]/50 text-white/90 hover:bg-white/10"
              }`}
            >
              <div className="font-semibold">{cur} → INR</div>
              <div className="text-[10px] text-white/50">{CURRENCY_MAP[cur]?.symbol} to ₹</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
