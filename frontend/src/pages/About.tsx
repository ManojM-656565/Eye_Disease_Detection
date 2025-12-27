export default function About() {
  return (
    <section className="max-w-4xl space-y-6">
      {/* Heading */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          About the Application
        </h2>
        <div className="h-1 w-20 bg-blue-600 rounded" />
      </div>

      {/* Description */}
      <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400">
        This application is designed to assist in the early detection of
        retinal eye diseases using advanced deep learning techniques.
        It analyzes retinal images to identify conditions such as
        <span className="font-medium text-slate-800 dark:text-slate-200">
          {" "}CNV, DME, Drusen, and Normal retinal patterns
        </span>,
        helping users gain quick and meaningful insights.
      </p>

      {/* Tech Stack Card */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-5">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Technology Stack
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          The frontend is built using
          <span className="font-medium text-blue-600"> React</span>,
          <span className="font-medium text-blue-600"> TypeScript</span>, and
          <span className="font-medium text-blue-600"> Tailwind CSS</span>,
          ensuring a fast, responsive, and accessible user experience.
          AI inference is powered by a
          <span className="font-medium text-emerald-600"> Flask</span>-based backend
          integrated with a trained deep learning model.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4">
        <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
          Disclaimer
        </h4>
        <p className="text-sm text-yellow-700 dark:text-yellow-400 leading-relaxed">
          This tool is intended for educational and assistive diagnostic purposes
          only. It is not a substitute for professional medical advice,
          diagnosis, or treatment. Always consult a qualified ophthalmologist
          for clinical evaluation.
        </p>
      </div>
    </section>
  );
}
