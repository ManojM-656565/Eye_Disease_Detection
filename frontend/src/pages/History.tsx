import { useEffect, useState } from "react";

/* -------------------- Types -------------------- */
type Label = "CNV" | "DME" | "Drusen" | "Normal";

type HistoryItem = {
  id: string;
  name: string;
  timestamp: string;
  label: Label;
  imageDataUrl?: string;
};

/* -------------------- Helpers -------------------- */
const labelColorMap: Record<Label, string> = {
  CNV: "text-red-400",
  DME: "text-amber-400",
  Drusen: "text-indigo-400",
  Normal: "text-emerald-400",
};

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  /* -------------------- Load history -------------------- */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("retina_history_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load history", err);
      setHistory([]);
    }
  }, []);

  /* -------------------- Clear history -------------------- */
  function clearHistory() {
    localStorage.removeItem("retina_history_v1");
    setHistory([]);
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-100">
          Prediction History
        </h2>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-sm text-red-400 hover:underline"
          >
            Clear history
          </button>
        )}
      </div>

      {/* Empty state */}
      {history.length === 0 && (
        <div className="rounded-lg border border-slate-700 bg-slate-900 p-6 text-center">
          <p className="text-slate-400 text-sm">
            No predictions yet.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Upload a retina image from the Dashboard to see results here.
          </p>
        </div>
      )}

      {/* History list */}
      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-lg border border-slate-700 bg-slate-900 p-4 hover:bg-slate-800 transition"
          >
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded overflow-hidden bg-slate-800 flex-shrink-0">
              {item.imageDataUrl ? (
                <img
                  src={item.imageDataUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                  No Image
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="font-medium text-slate-100">
                {item.name}
              </div>
              <div className="text-xs text-slate-400">
                {new Date(item.timestamp).toLocaleString()}
              </div>
            </div>

            {/* Label */}
            <div className="text-sm font-semibold">
              <span className={labelColorMap[item.label]}>
                {item.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      {history.length > 0 && (
        <p className="text-xs text-slate-500 pt-2">
          ⚠️ Results are stored locally in your browser and may be cleared at any time.
        </p>
      )}
    </div>
  );
}
