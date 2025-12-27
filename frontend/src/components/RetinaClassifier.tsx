
// import { useState, useRef, useEffect } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// /* -------------------- Types -------------------- */
// type Label = "CNV" | "DME" | "Drusen" | "Normal";

// type PredictResponse = {
//   label: Label;
//   confidences: Record<Label, number>; // 0–1
// };

// type HistoryItem = {
//   id: string;
//   name: string;
//   timestamp: string;
//   label: Label;
//   confidences: Record<Label, number>;
//   imageDataUrl?: string;
// };

// /* -------------------- Constants -------------------- */
// const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
// const MAX_BYTES = 5 * 1024 * 1024; // 5MB

// /* -------------------- Component -------------------- */
// export default function RetinaClassifier() {
//   const [file, setFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<PredictResponse | null>(null);
//   const [history, setHistory] = useState<HistoryItem[]>([]);
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   /* -------------------- Effects -------------------- */
//   useEffect(() => {
//     const saved = localStorage.getItem("retina_history_v1");
//     if (saved) setHistory(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     if (!file) {
//       setPreview(null);
//       return;
//     }
//     const reader = new FileReader();
//     reader.onload = () => setPreview(String(reader.result));
//     reader.readAsDataURL(file);
//   }, [file]);

//   useEffect(() => {
//     localStorage.setItem("retina_history_v1", JSON.stringify(history));
//   }, [history]);

//   /* -------------------- Helpers -------------------- */
//   function validateFile(f: File) {
//     if (!ACCEPTED_TYPES.includes(f.type))
//       return "Unsupported file type. Use JPG or PNG.";
//     if (f.size > MAX_BYTES)
//       return `File too large. Max ${MAX_BYTES / (1024 * 1024)}MB.`;
//     return null;
//   }

//   function handleFileInputChange(
//     e: React.ChangeEvent<HTMLInputElement>
//   ) {
//     setError(null);
//     const f = e.target.files?.[0];
//     if (!f) return;

//     const v = validateFile(f);
//     if (v) {
//       setError(v);
//       setFile(null);
//       return;
//     }
//     setFile(f);
//   }

//   /* -------------------- MOCK PREDICTION -------------------- */
//   async function sendPrediction() {
//     if (!file) {
//       setError("Please select an image before submitting.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setResult(null);

//     // ⏱ simulate model inference delay
//     setTimeout(() => {
//       const labels: Label[] = ["CNV", "DME", "Drusen", "Normal"];

//       // pick random disease
//       const detected =
//         labels[Math.floor(Math.random() * labels.length)];

//       // generate realistic confidences
//       let remaining = 1;
//       const confidences: Record<Label, number> = {
//         CNV: 0,
//         DME: 0,
//         Drusen: 0,
//         Normal: 0,
//       };

//       // dominant class: 60–90%
//       confidences[detected] = +(
//         0.6 + Math.random() * 0.3
//       ).toFixed(4);
//       remaining -= confidences[detected];

//       // distribute remaining probability
//       labels
//         .filter((l) => l !== detected)
//         .forEach((l, i, arr) => {
//           if (i === arr.length - 1) {
//             confidences[l] = +remaining.toFixed(4);
//           } else {
//             const v = +(Math.random() * remaining).toFixed(4);
//             confidences[l] = v;
//             remaining -= v;
//           }
//         });

//       const payload: PredictResponse = {
//         label: detected,
//         confidences,
//       };

//       setResult(payload);

//       const item: HistoryItem = {
//         id: Date.now().toString(),
//         name: file.name,
//         timestamp: new Date().toISOString(),
//         label: payload.label,
//         confidences: payload.confidences,
//         imageDataUrl: preview || undefined,
//       };

//       setHistory((h) => [item, ...h].slice(0, 50));
//       setLoading(false);
//     }, 1500);
//   }

//   function clearAll() {
//     setFile(null);
//     setPreview(null);
//     setResult(null);
//     setError(null);
//     if (inputRef.current) inputRef.current.value = "";
//   }

//   function downloadReport(item: HistoryItem) {
//     const text = `Retina Analysis Report
// ----------------------
// File: ${item.name}
// Time: ${item.timestamp}
// Detected: ${item.label}

// Confidences:
// CNV: ${(item.confidences.CNV * 100).toFixed(2)}%
// DME: ${(item.confidences.DME * 100).toFixed(2)}%
// Drusen: ${(item.confidences.Drusen * 100).toFixed(2)}%
// Normal: ${(item.confidences.Normal * 100).toFixed(2)}%
// `;
//     const blob = new Blob([text], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `retina_report_${item.id}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   }

//   const chartData = result
//     ? (Object.keys(result.confidences) as Label[]).map((k) => ({
//         name: k,
//         value: Math.round(result.confidences[k] * 100),
//       }))
//     : [];

//   /* -------------------- UI -------------------- */
//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center p-6">
//       <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 bg-slate-900 p-6 rounded-xl">
//         {/* LEFT */}
//         <section className="space-y-4">
//           <h2 className="text-xl font-semibold">
//             Retina Image Analyzer
//           </h2>

//           <input
//             ref={inputRef}
//             type="file"
//             accept=".jpg,.jpeg,.png"
//             onChange={handleFileInputChange}
//             className="block text-sm"
//           />

//           {error && (
//             <div className="bg-red-900/40 p-2 rounded text-sm">
//               {error}
//             </div>
//           )}

//           <div className="h-48 bg-slate-800 rounded flex items-center justify-center">
//             {preview ? (
//               <img
//                 src={preview}
//                 alt="preview"
//                 className="max-h-44 object-contain"
//               />
//             ) : (
//               <span className="text-slate-400">
//                 No image selected
//               </span>
//             )}
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={sendPrediction}
//               disabled={loading || !file}
//               className="flex-1 bg-emerald-600 text-black py-2 rounded disabled:opacity-40"
//             >
//               {loading ? "Analyzing..." : "Analyze"}
//             </button>

//             <button
//               onClick={clearAll}
//               className="px-3 py-2 border border-slate-700 rounded"
//             >
//               Clear
//             </button>
//           </div>

//           <h3 className="text-sm font-semibold mt-4">
//             History
//           </h3>
//           <div className="max-h-40 overflow-auto space-y-2">
//             {history.length === 0 && (
//               <p className="text-xs text-slate-400">
//                 No previous results
//               </p>
//             )}
//             {history.map((h) => (
//               <div
//                 key={h.id}
//                 className="flex justify-between bg-slate-800 p-2 rounded"
//               >
//                 <div>
//                   <div className="text-sm">{h.name}</div>
//                   <div className="text-xs text-slate-400">
//                     {h.label}
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => downloadReport(h)}
//                   className="text-xs underline"
//                 >
//                   Download
//                 </button>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* RIGHT */}
//         <aside className="space-y-4">
//           <h2 className="text-lg font-semibold">Results</h2>

//           {!result && !loading && (
//             <p className="text-slate-400 text-sm">
//               Upload an image and analyze.
//             </p>
//           )}

//           {loading && (
//             <p className="text-slate-300 text-sm">
//               Running model inference…
//             </p>
//           )}

//           {result && (
//             <>
//               <div>
//                 <div className="text-sm text-slate-400">
//                   Detected
//                 </div>
//                 <div className="text-2xl font-bold">
//                   {result.label}
//                 </div>
//                 <div className="text-sm">
//                   Confidence:{" "}
//                   {(
//                     result.confidences[result.label] * 100
//                   ).toFixed(2)}
//                   %
//                 </div>
//               </div>

//               <div className="h-40">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={chartData} layout="vertical">
//                     <XAxis type="number" domain={[0, 100]} hide />
//                     <YAxis type="category" dataKey="name" />
//                     {/* <Tooltip formatter={(v: number) => `${v}%`} /> */}
//                     <Tooltip
//   formatter={(value) =>
//     typeof value === "number" ? `${value}%` : value
//   }
// />

//                     <Bar dataKey="value" barSize={14} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </>
//           )}

//           <p className="text-xs text-slate-400">
//             ⚠️ For educational/demo purposes only.
//           </p>
//         </aside>
//       </div>
//     </div>
//   );
// }

import { useState, useRef, useEffect } from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
} from "recharts";

/* -------------------- Types -------------------- */
type Label = "CNV" | "DME" | "Drusen" | "Normal";

type PredictResponse = {
  label: Label;
  confidences: Record<Label, number>;
};

type HistoryItem = {
  id: string;
  name: string;
  timestamp: string;
  label: Label;
  confidences: Record<Label, number>;
  imageDataUrl?: string;
};

/* -------------------- Constants -------------------- */
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_BYTES = 5 * 1024 * 1024;

/* -------------------- Helpers -------------------- */
function extractNumberFromFileName(fileName: string): number | null {
  const match = fileName.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function getLabelFromNumber(num: number): Label {
  if (num >= 1 && num <= 10) return "Drusen";
  if (num >= 11 && num <= 20) return "CNV";
  if (num >= 21 && num <= 30) return "DME";
  return "Normal";
}

/* -------------------- Component -------------------- */
export default function RetinaClassifier() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /* -------------------- Effects -------------------- */
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

  /* -------------------- Validation -------------------- */
  function validateFile(f: File) {
    if (!ACCEPTED_TYPES.includes(f.type))
      return "Unsupported file type. Use JPG or PNG.";
    if (f.size > MAX_BYTES)
      return "File too large. Max 5MB.";
    return null;
  }

  function handleFileInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setError(null);
    const f = e.target.files?.[0];
    if (!f) return;

    const v = validateFile(f);
    if (v) {
      setError(v);
      setFile(null);
      return;
    }
    setFile(f);
  }

  /* -------------------- HARD-CODED PREDICTION -------------------- */
  async function sendPrediction() {
    if (!file) {
      setError("Please select an image.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    setTimeout(() => {
      const num = extractNumberFromFileName(file.name);

      if (!num) {
        setError("Filename must contain a number (e.g. retina_12.jpg)");
        setLoading(false);
        return;
      }

      const detected = getLabelFromNumber(num);

      const base = +(0.7 + Math.random() * 0.25).toFixed(4);
      let remaining = +(1 - base).toFixed(4);

      const confidences: Record<Label, number> = {
        CNV: 0,
        DME: 0,
        Drusen: 0,
        Normal: 0,
      };

      confidences[detected] = base;

      (Object.keys(confidences) as Label[])
        .filter((l) => l !== detected)
        .forEach((l, i, arr) => {
          if (i === arr.length - 1) {
            confidences[l] = +remaining.toFixed(4);
          } else {
            const v = +(Math.random() * remaining).toFixed(4);
            confidences[l] = v;
            remaining -= v;
          }
        });

      const payload: PredictResponse = {
        label: detected,
        confidences,
      };

      setResult(payload);

      const item: HistoryItem = {
        id: Date.now().toString(),
        name: file.name,
        timestamp: new Date().toISOString(),
        label: detected,
        confidences,
        imageDataUrl: preview || undefined,
      };

      setHistory((h) => [item, ...h].slice(0, 50));
      setLoading(false);
    }, 1200);
  }

  function clearAll() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function downloadReport(item: HistoryItem) {
    const text = `Retina Analysis Report
-------------------------
File: ${item.name}
Time: ${item.timestamp}
Detected: ${item.label}

Confidences:
CNV: ${(item.confidences.CNV * 100).toFixed(2)}%
DME: ${(item.confidences.DME * 100).toFixed(2)}%
Drusen: ${(item.confidences.Drusen * 100).toFixed(2)}%
Normal: ${(item.confidences.Normal * 100).toFixed(2)}%
`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `retina_report_${item.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const chartData = result
    ? (Object.keys(result.confidences) as Label[]).map((k) => ({
        name: k,
        value: Math.round(result.confidences[k] * 100),
      }))
    : [];

  /* -------------------- UI -------------------- */
  return (
    // <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center p-6">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 bg-slate-900 p-6 rounded-xl">
        {/* LEFT */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            Retina Image Analyzer
          </h2>

          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileInputChange}
            className="text-sm p-2 rounded text-black border border-slate-700 block bg-emerald-600 hover:bg-emerald-700 transition"
          />

          {error && (
            <div className="bg-red-900/40 p-2 rounded text-sm">
              {error}
            </div>
          )}

          <div className="h-48 bg-slate-800 rounded flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="max-h-44 object-contain"
              />
            ) : (
              <span className="text-slate-400">
                No image selected
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={sendPrediction}
              disabled={loading || !file}
              className="flex-1 bg-emerald-600 text-black py-2 rounded disabled:opacity-40"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>

            <button
              onClick={clearAll}
              className="px-3 py-2 border border-slate-700 rounded"
            >
              Clear
            </button>
          </div>

          <h3 className="text-sm font-semibold mt-4">
            History
          </h3>

          <div className="max-h-40 overflow-auto space-y-2">
            {history.length === 0 && (
              <p className="text-xs text-slate-400">
                No previous results
              </p>
            )}

            {history.map((h) => (
              <div
                key={h.id}
                className="flex justify-between bg-slate-800 p-2 rounded"
              >
                <div>
                  <div className="text-sm">{h.name}</div>
                  <div className="text-xs text-slate-400">
                    {h.label}
                  </div>
                </div>
                <button
                  onClick={() => downloadReport(h)}
                  className="text-xs underline"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT */}
        <aside className="space-y-4">
          <h2 className="text-lg font-semibold">Results</h2>

          {!result && !loading && (
            <p className="text-slate-400 text-sm">
              Upload an image and analyze.
            </p>
          )}

          {loading && (
            <p className="text-slate-300 text-sm">
              Running inference…
            </p>
          )}

          {result && (
            <>
              <div>
                <div className="text-sm text-slate-400">
                  Detected
                </div>
                <div className="text-2xl font-bold">
                  {result.label}
                </div>
                <div className="text-sm">
                  Confidence:{" "}
                  {(result.confidences[result.label] * 100).toFixed(2)}%
                </div>
              </div>

<div className="h-56 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

      <XAxis
        dataKey="name"
        tick={{ fill: "#334155", fontSize: 14 }}
        axisLine={{ stroke: "#cbd5e1" }}
        tickLine={false}
      />

      <YAxis
        domain={[0, 100]}
        tick={{ fill: "#334155", fontSize: 14 }}
        axisLine={{ stroke: "#cbd5e1" }}
        tickLine={false}
      />

      <Tooltip
        contentStyle={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          fontSize: "14px",
        }}
        formatter={(value) =>
          typeof value === "number" ? `${value}%` : value
        }
      />

      <Area
        type="monotone"
        dataKey="value"
        stroke="#2563eb"
        fill="#93c5fd"
        strokeWidth={3}
        activeDot={{ r: 7 }}
        isAnimationActive
      />
    </AreaChart>
  </ResponsiveContainer>
</div>


            </>
          )}

          <p className="text-xs text-slate-400">
            ⚠️ Rule-based demo inference (filename driven)
          </p>
        </aside>
      </div>
    // </div>
  );
}
