import { useEffect, useState } from "react";

type HistoryItem = {
  id: string;
  name: string;
  timestamp: string;
  label: string;
  imageDataUrl?: string;
};

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("retina_history_v1");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">History</h2>
      <div className="space-y-3">
        {history.length === 0 && (
          <p className="text-slate-400 text-sm">No predictions yet.</p>
        )}

        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-lg p-3"
          >
            <div className="w-16 h-16 rounded overflow-hidden bg-slate-700 flex-shrink-0">
              {item.imageDataUrl && (
                <img
                  src={item.imageDataUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{item.name}</div>
              <div className="text-xs text-slate-400">
                {new Date(item.timestamp).toLocaleString()}
              </div>
              <div className="text-sm mt-1">
                <span className="text-emerald-400 font-semibold">
                  {item.label}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
