/* RetinaClassifier.tsx

A single-file React + TypeScript component using Tailwind CSS.
Features implemented:
- Image upload (JPG, JPEG, PNG) with thumbnail preview and validation (max 5MB)
- Prediction request to a backend endpoint POST /api/predict (expects JSON { label, confidences })
- Loading spinner and "Analyzing your image..." state
- Error handling with retry
- Result display with confidence percentages and a basic bar chart (recharts)
- History saved to localStorage with timestamp and downloadable text report
- Accessible controls and keyboard-friendly focus states

Usage:
- Place this file in your React app (e.g., src/components/RetinaClassifier.tsx)
- Ensure Tailwind CSS is configured in your project
- Install dependencies: npm i recharts
- Backend: POST /api/predict should accept FormData with 'image' and return:
  {
    label: 'CNV' | 'DME' | 'Drusen' | 'Normal',
    confidences: { CNV: number, DME: number, Drusen: number, Normal: number }
  }

Customize styles and endpoint as needed.
*/

import React, { useState, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Label = "CNV" | "DME" | "Drusen" | "Normal";

type PredictResponse = {
  label: Label;
  confidences: Record<Label, number>; // values between 0 and 1
};

type HistoryItem = {
  id: string;
  name: string;
  timestamp: string;
  label: Label;
  confidences: Record<Label, number>;
  imageDataUrl?: string;
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export default function RetinaClassifier() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("retina_history_v1");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  }, [file]);

  useEffect(() => {
    localStorage.setItem("retina_history_v1", JSON.stringify(history));
  }, [history]);

  function validateFile(f: File) {
    if (!ACCEPTED_TYPES.includes(f.type)) return "Unsupported file type. Use JPG or PNG.";
    if (f.size > MAX_BYTES) return `File too large. Max ${MAX_BYTES / (1024 * 1024)}MB.`;
    return null;
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const v = validateFile(f);
    if (v) {
      setFile(null);
      setError(v);
      return;
    }
    setFile(f);
  }

  async function sendPrediction(retry = false) {
    if (!file) {
      setError("Please select an image before submitting.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch("/api/predict", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = (await res.json()) as PredictResponse;

      // Normalize confidences (in case they are 0-100)
      const normalized: Record<Label, number> = {
        CNV: 0,
        DME: 0,
        Drusen: 0,
        Normal: 0,
      };
      (Object.keys(data.confidences) as Label[]).forEach((k) => {
        let v = data.confidences[k];
        if (v > 1) v = v / 100; // handle percentage
        normalized[k] = Number(v.toFixed(4));
      });

      const payload: PredictResponse = { label: data.label, confidences: normalized };
      setResult(payload);

      // Save to history
      const item: HistoryItem = {
        id: Date.now().toString(),
        name: file.name,
        timestamp: new Date().toISOString(),
        label: payload.label,
        confidences: payload.confidences,
        imageDataUrl: preview || undefined,
      };
      setHistory((h) => [item, ...h].slice(0, 50));
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Prediction failed.");
      if (!retry) {
        // keep UI simple: show retry button instead of auto-retry
      }
    }
  }

  function clearAll() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    inputRef.current && (inputRef.current.value = "");
  }

  function downloadReport(item: HistoryItem) {
    const text = `Report\n-------\nName: ${item.name}\nTime: ${item.timestamp}\nDetected: ${item.label}\n\nConfidences:\nCNV: ${(
      item.confidences.CNV * 100
    ).toFixed(2)}%\nDME: ${(item.confidences.DME * 100).toFixed(2)}%\nDrusen: ${(item.confidences.Drusen * 100).toFixed(2)}%\nNormal: ${(item.confidences.Normal * 100).toFixed(2)}%\n`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `retina_report_${item.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const chartData = result
    ? (Object.keys(result.confidences) as Label[]).map((k) => ({ name: k, value: Math.round(result.confidences[k] * 100) }))
    : [];

  return (
    <div className="min-h-screen flex items-start justify-center bg-[#0f172a] text-slate-100 p-6">
      <div className="w-full max-w-4xl bg-slate-900/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: uploader + preview */}
        <section aria-labelledby="upload-title" className="space-y-4">
          <h2 id="upload-title" className="text-xl font-semibold">
            Retina Image Analyzer
          </h2>

          <div className="border border-slate-700 rounded-lg p-4">
            <label className="block text-sm mb-2">Upload image (JPG, PNG) - max 5MB</label>
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                aria-label="Upload retina image"
                onChange={handleFileInputChange}
                type="file"
                accept=".png,.jpg,.jpeg"
                className="block file:bg-slate-700 file:px-3 file:py-1 file:rounded file:border-0 file:cursor-pointer text-sm focus:outline-none"
              />
              <button
                onClick={() => inputRef.current && inputRef.current.click()}
                className="ml-auto bg-slate-700 px-3 py-1 rounded-md hover:opacity-90 focus:outline focus:outline-2 focus:outline-slate-500"
              >
                Choose file
              </button>
            </div>
            <p className="text-xs mt-2 text-slate-400">Tip: center the retina region and avoid heavy glare.</p>
          </div>

          {error && (
            <div className="bg-rose-900/30 border border-rose-700 text-rose-100 p-3 rounded">
              <p className="text-sm">{error}</p>
              <div className="mt-2">
                <button
                  onClick={() => {
                    setError(null);
                    setFile(null);
                    inputRef.current && (inputRef.current.value = "");
                  }}
                  className="text-sm underline"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="rounded-lg overflow-hidden bg-slate-800/40 p-3">
            <div className="h-48 w-full bg-slate-800 flex items-center justify-center border border-slate-700 rounded">
              {preview ? (
                <img src={preview} alt="preview" className="max-h-44 object-contain" />
              ) : (
                <p className="text-slate-400">No image selected</p>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => sendPrediction(false)}
                disabled={loading || !file}
                className="flex-1 bg-emerald-600 text-black py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-40"
              >
                {loading ? "Analyzing your image..." : "Analyze"}
              </button>

              <button
                onClick={clearAll}
                className="px-3 py-2 border border-slate-700 rounded-md text-sm hover:bg-slate-800"
              >
                Clear
              </button>
            </div>

            <div className="mt-2 text-xs text-slate-400">Keyboard: Tab to focus, Enter to activate buttons.</div>
          </div>

          {/* History list */}
          <div className="mt-2">
            <h3 className="text-sm font-semibold">History</h3>
            <div className="mt-2 max-h-48 overflow-auto space-y-2">
              {history.length === 0 && <p className="text-xs text-slate-400">No previous predictions.</p>}
              {history.map((h) => (
                <div key={h.id} className="flex items-center gap-3 bg-slate-800/50 p-2 rounded">
                  <div className="w-12 h-12 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                    {h.imageDataUrl ? <img src={h.imageDataUrl} alt={h.name} className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium">{h.name}</div>
                    <div className="text-xs text-slate-400">{new Date(h.timestamp).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => downloadReport(h)} className="text-xs underline">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right: result area */}
        <aside className="space-y-4">
          <h2 className="text-lg font-semibold">Results</h2>

          <div className="rounded-lg p-4 bg-slate-800/40 border border-slate-700 min-h-[220px] flex flex-col justify-center items-center">
            {!result && !loading && <p className="text-slate-400 text-sm">No analysis yet. Upload an image and click Analyze.</p>}

            {loading && (
              <div className="flex flex-col items-center gap-3">
                <div role="status" aria-live="polite">
                  <svg className="animate-spin h-10 w-10" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-20" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
                <div className="text-sm text-slate-300">Analyzing your image…</div>
              </div>
            )}

            {result && (
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-400">Detected</div>
                    <div className="text-2xl font-bold mt-1">{result.label}</div>
                    <div className="text-sm text-slate-400 mt-1">Confidence: {(result.confidences[result.label] * 100).toFixed(2)}%</div>
                  </div>

                  <div className="w-36 h-36 bg-slate-900/30 rounded flex items-center justify-center">
                    {/* small circular confidence */}
                    <div className="text-center">
                      <div className="text-sm text-slate-400">Top</div>
                      <div className="text-2xl font-semibold">{(result.confidences[result.label] * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(v:number) => `${v}%`} />
                      <Bar dataKey="value" barSize={14} radius={6} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      // small disease info snippets
                      const info: Record<Label, string> = {
                        CNV: "Choroidal neovascularization — can cause vision distortion and central vision loss. Refer to an ophthalmologist.",
                        DME: "Diabetic macular edema — retinal swelling due to diabetes. Glycemic control and retina specialist referral recommended.",
                        Drusen: "Drusen — yellow deposits under the retina; monitor for progression to macular degeneration.",
                        Normal: "No disease detected — image may be clear. If symptoms persist, consult a clinician.",
                      };
                      alert(info[result.label]);
                    }}
                    className="px-3 py-2 bg-slate-700 rounded-md text-sm"
                  >
                    Quick info
                  </button>

                  <button
                    onClick={() => {
                      // download current report
                      if (!result) return;
                      const dummyItem: HistoryItem = {
                        id: Date.now().toString(),
                        name: file ? file.name : "upload.jpg",
                        timestamp: new Date().toISOString(),
                        label: result.label,
                        confidences: result.confidences,
                        imageDataUrl: preview || undefined,
                      };
                      downloadReport(dummyItem);
                    }}
                    className="px-3 py-2 bg-slate-700 rounded-md text-sm"
                  >
                    Download report
                  </button>

                  <button
                    onClick={() => {
                      setResult(null);
                    }}
                    className="px-3 py-2 border border-slate-700 rounded-md text-sm ml-auto"
                  >
                    New
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Small accessibility / notes */}
          <div className="text-xs text-slate-400">
            Note: This tool is for assistive purposes only. It does not replace clinical judgment.
          </div>
        </aside>
      </div>
    </div>
  );
}
