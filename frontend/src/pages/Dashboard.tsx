import RetinaClassifier from "../components/RetinaClassifier";

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <p className="text-slate-400 text-sm mb-4">
        Upload retina images and get predictions with confidence levels.
      </p>
      <RetinaClassifier />
    </div>
  );
}
