import React from "react";

export default function About() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">About</h2>
      <p className="text-slate-400">
        This application uses a deep learning model to assist in detecting
        retinal conditions such as CNV, DME, Drusen, and Normal retinas.
      </p>
      <p className="text-slate-400">
        Developed with React + TypeScript + Tailwind CSS, and powered by Flask
        backend for AI inference. The tool is for educational and assistive
        diagnostic purposes only.
      </p>
    </div>
  );
}
