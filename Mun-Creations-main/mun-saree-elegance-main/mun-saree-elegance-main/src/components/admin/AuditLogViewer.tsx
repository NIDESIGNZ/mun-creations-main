import { useState, useEffect } from "react";
import { getAdminAuditLogs, type AuditLogEntry } from "@/lib/admin-client";
import { History, RefreshCw, Filter, ShieldCheck } from "lucide-react";

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await getAdminAuditLogs(100);
      setLogs(data);
    } catch (err: any) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6 text-xs text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[var(--gold)]" />
            <h2 className="font-serif text-2xl font-bold text-white">
              System Audit & Change Ledger
            </h2>
          </div>
          <p className="text-slate-400 mt-1">
            Complete traceability of catalog edits, price adjustments, stock movements, and administrative events.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3.5 py-2 rounded flex items-center gap-1.5 border border-slate-700 self-start md:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5 text-[var(--gold)]" />
          <span>Refresh Logs</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-[var(--gold)]" />
            <div>Loading audit log records...</div>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No audit log entries recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Entity Type</th>
                  <th className="p-3">Entity Reference</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Details / Snapshot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="p-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 font-sans">
                      <span className="bg-slate-800 text-white px-2 py-0.5 rounded font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-sans uppercase text-slate-400 text-[10px]">
                      {log.entityType}
                    </td>
                    <td className="p-3 font-medium text-white">{log.entityId || "—"}</td>
                    <td className="p-3 font-sans text-slate-300">{log.user}</td>
                    <td className="p-3 font-mono text-[10px] text-slate-400 max-w-md truncate">
                      {log.details ? JSON.stringify(log.details) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
