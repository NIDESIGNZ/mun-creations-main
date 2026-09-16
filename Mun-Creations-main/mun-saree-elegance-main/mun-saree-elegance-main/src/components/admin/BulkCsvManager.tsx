import { useState } from "react";
import {
  bulkImportAdminProducts,
  getExportProductsUrl,
} from "@/lib/admin-client";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  RefreshCw,
  X,
} from "lucide-react";

const SAMPLE_CSV = `name,sku,category,subcategory,fabric,color,priceUsd,priceInr,stockQuantity,description
Varanasi Royal Katan Saree,MUN-KAT-991,Banarasi,Katan Silk,Pure Katan Silk,Peacock Teal,380,31730,8,Handcrafted Banarasi with tested antique zari.
Kanchipuram Temple Gold Weave,MUN-KAN-992,Kanjivaram,Temple Border,Pure Mulberry Silk,Temple Vermilion,490,40915,5,Pure silk handwoven on traditional twin-shuttle looms.
Tussar Tribal Fusion Saree,MUN-TUS-993,Tussar,Tribal Weave,Wild Tussar Silk,Earth Ochre,240,20040,12,Natural golden sheen wild silk with hand-painted tribal motifs.`;

interface ParsedPreviewRow {
  rowNum: number;
  data: Record<string, string>;
  isValid: boolean;
  errors: string[];
}

export function BulkCsvManager({ onImportCompleted }: { onImportCompleted?: () => void }) {
  const [csvText, setCsvText] = useState("");
  const [step, setStep] = useState<"input" | "preview" | "complete">("input");
  const [previewRows, setPreviewRows] = useState<ParsedPreviewRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    importedCount: number;
    errors: string[];
    duplicateSkus: string[];
  } | null>(null);

  const [copied, setCopied] = useState(false);

  // File drop/upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setCsvText(text);
        validateAndPreview(text);
      }
    };
    reader.readAsText(file);
  };

  // Step 2: Validate and preview CSV rows
  const validateAndPreview = (raw: string) => {
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      alert("CSV must contain at least a header line and one data row.");
      return;
    }

    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    const required = ["name", "priceUsd", "category", "fabric"];
    const missingHeaders = required.filter(
      (r) => !headers.some((h) => h.toLowerCase() === r.toLowerCase())
    );

    if (missingHeaders.length > 0) {
      alert(`CSV header is missing required columns: ${missingHeaders.join(", ")}`);
      return;
    }

    const parsed: ParsedPreviewRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const rowNum = i + 1;
      const values: string[] = [];
      let inQuotes = false;
      let curr = "";

      for (let chIdx = 0; chIdx < lines[i].length; chIdx++) {
        const char = lines[i][chIdx];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(curr.trim());
          curr = "";
        } else {
          curr += char;
        }
      }
      values.push(curr.trim());

      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] ? values[idx].replace(/^"|"$/g, "").trim() : "";
      });

      // Validation
      const errors: string[] = [];
      if (!rowObj.name) errors.push("Missing name");
      if (!rowObj.category) errors.push("Missing category");
      if (!rowObj.fabric) errors.push("Missing fabric");
      if (!rowObj.priceUsd || isNaN(Number(rowObj.priceUsd))) errors.push("Invalid priceUsd");

      parsed.push({
        rowNum,
        data: rowObj,
        isValid: errors.length === 0,
        errors,
      });
    }

    setPreviewRows(parsed);
    setStep("preview");
  };

  // Step 3: Execute bulk import
  const handleExecuteImport = async () => {
    if (!csvText.trim()) return;
    setImporting(true);
    try {
      const res = await bulkImportAdminProducts(csvText);
      setImportResult(res);
      setStep("complete");
      if (onImportCompleted) onImportCompleted();
    } catch (err: any) {
      alert(`Import failed: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleCopySample = () => {
    navigator.clipboard.writeText(SAMPLE_CSV);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "mun_creations_sample_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validCount = previewRows.filter((r) => r.isValid).length;
  const invalidCount = previewRows.filter((r) => !r.isValid).length;

  return (
    <div className="space-y-6 text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-white">
              Bulk CSV Import & Catalog Export
            </h2>
          </div>
          <p className="text-slate-400 mt-1">
            Two-step bulk product ingestion engine with pre-import validation and duplicate SKU detection.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadSample}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3.5 py-2 rounded flex items-center gap-1.5 border border-slate-700"
          >
            <Download className="h-3.5 w-3.5 text-[var(--gold)]" />
            <span>Download CSV Template</span>
          </button>

          <a
            href={getExportProductsUrl()}
            target="_blank"
            rel="noreferrer"
            className="bg-[var(--gold)] hover:bg-white text-slate-950 font-bold px-4 py-2 rounded flex items-center gap-1.5 uppercase tracking-wider"
          >
            <Download className="h-4 w-4" />
            <span>Export Full Catalog</span>
          </a>
        </div>
      </div>

      {/* STEP 1: INPUT */}
      {step === "input" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* File Upload & Paste box */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-5 rounded space-y-4">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <Upload className="h-4 w-4 text-[var(--gold)]" />
              <span>Step 1: Ingest CSV Data</span>
            </h3>

            {/* Dropzone */}
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700 hover:border-[var(--gold)] rounded cursor-pointer transition-colors bg-slate-950">
              <FileSpreadsheet className="h-8 w-8 text-[var(--gold)] mb-2" />
              <span className="font-bold text-white text-sm">Click to Select CSV File from Computer</span>
              <span className="text-slate-400 text-[11px] mt-1">Supports standard UTF-8 CSV files</span>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-slate-800"></div>
              <span className="text-slate-500 uppercase font-mono text-[10px]">OR PASTE RAW CSV</span>
              <div className="flex-1 h-px bg-slate-800"></div>
            </div>

            {/* Textarea */}
            <div className="space-y-1">
              <textarea
                rows={8}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="Paste CSV text here including column headers..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded font-mono text-white text-[11px] focus:outline-none focus:border-[var(--gold)]"
              />
            </div>

            <button
              onClick={() => validateAndPreview(csvText)}
              disabled={!csvText.trim()}
              className="w-full bg-[var(--gold)] hover:bg-white text-slate-950 font-bold py-2.5 rounded uppercase tracking-wider disabled:opacity-40"
            >
              Validate & Preview Rows &rarr;
            </button>
          </div>

          {/* Guidelines sidebar */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-5 rounded space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--gold)]" />
                <span>Format Guidelines</span>
              </h4>
              <button
                onClick={handleCopySample}
                className="text-[11px] text-[var(--gold)] hover:underline flex items-center gap-1 font-bold"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy Sample"}</span>
              </button>
            </div>

            <div className="space-y-2 text-slate-300">
              <p className="font-semibold text-white">Mandatory Columns:</p>
              <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-slate-400">
                <li><code className="text-white">name</code> — Saree title</li>
                <li><code className="text-white">category</code> — Banarasi, Kanjivaram, etc.</li>
                <li><code className="text-white">fabric</code> — Pure Katan, Tussar, etc.</li>
                <li><code className="text-white">priceUsd</code> — Retail number ($)</li>
              </ul>

              <p className="font-semibold text-white pt-2">Optional Recommended Columns:</p>
              <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-slate-400">
                <li><code>sku</code> (Auto-generated if blank)</li>
                <li><code>subcategory</code></li>
                <li><code>color</code></li>
                <li><code>priceInr</code> (Auto-computed if blank)</li>
                <li><code>stockQuantity</code> (Defaults to 1)</li>
                <li><code>description</code></li>
                <li><code>image</code> (Image URL)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PREVIEW & VALIDATE */}
      {step === "preview" && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Step 2: Pre-Import Validation Preview</span>
              </h3>
              <div className="text-slate-400 text-[11px] mt-0.5">
                Found {previewRows.length} total rows:{" "}
                <span className="text-emerald-400 font-bold">{validCount} valid</span>,{" "}
                <span className="text-red-400 font-bold">{invalidCount} with issues</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep("input")}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-2 rounded"
              >
                Back to Edit
              </button>

              <button
                onClick={handleExecuteImport}
                disabled={importing || validCount === 0}
                className="bg-[var(--gold)] hover:bg-white text-slate-950 font-bold px-5 py-2 rounded uppercase tracking-wider flex items-center gap-1.5"
              >
                {importing && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>{importing ? "Importing to DB..." : `Execute Import (${validCount} Products)`}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="p-2.5">Row</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Name</th>
                  <th className="p-2.5">SKU</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Fabric</th>
                  <th className="p-2.5">Price</th>
                  <th className="p-2.5">Qty</th>
                  <th className="p-2.5">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {previewRows.map((r) => (
                  <tr
                    key={r.rowNum}
                    className={r.isValid ? "hover:bg-slate-800/30" : "bg-red-950/30"}
                  >
                    <td className="p-2.5 text-slate-500">#{r.rowNum}</td>
                    <td className="p-2.5">
                      {r.isValid ? (
                        <span className="text-emerald-400 font-bold">READY</span>
                      ) : (
                        <span className="text-red-400 font-bold">INVALID</span>
                      )}
                    </td>
                    <td className="p-2.5 font-sans font-medium text-white max-w-xs truncate">
                      {r.data.name || "—"}
                    </td>
                    <td className="p-2.5 text-slate-400">{r.data.sku || "(Auto)"}</td>
                    <td className="p-2.5 font-sans">{r.data.category || "—"}</td>
                    <td className="p-2.5 font-sans">{r.data.fabric || "—"}</td>
                    <td className="p-2.5 font-bold text-white">${r.data.priceUsd || "0"}</td>
                    <td className="p-2.5">{r.data.stockQuantity || "1"}</td>
                    <td className="p-2.5 font-sans text-red-300">
                      {r.errors.length > 0 ? r.errors.join(", ") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STEP 3: COMPLETED */}
      {step === "complete" && importResult && (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded text-center space-y-4 max-w-xl mx-auto animate-in zoom-in-95">
          <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">Bulk Ingestion Completed!</h3>
          <p className="text-slate-300 text-sm">
            Successfully imported{" "}
            <span className="font-bold text-emerald-400 text-lg">
              {importResult.importedCount} products
            </span>{" "}
            directly into the unified database.
          </p>

          {importResult.duplicateSkus && importResult.duplicateSkus.length > 0 && (
            <div className="p-3 bg-amber-950/40 border border-amber-800 rounded text-left text-amber-200 text-xs">
              <div className="font-bold">Duplicate SKUs updated:</div>
              <div>{importResult.duplicateSkus.join(", ")}</div>
            </div>
          )}

          {importResult.errors && importResult.errors.length > 0 && (
            <div className="p-3 bg-red-950/40 border border-red-800 rounded text-left text-red-200 text-xs">
              <div className="font-bold">Skipped rows with errors:</div>
              <ul className="list-disc list-inside mt-1">
                {importResult.errors.map((e, idx) => (
                  <li key={idx}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                setCsvText("");
                setStep("input");
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-2.5 rounded text-xs"
            >
              Import Another CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
