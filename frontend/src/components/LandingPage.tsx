import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-white">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-emerald-400">RetinaVision</h1>
        <nav className="hidden md:flex items-center gap-8 text-slate-300">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#how" className="hover:text-white transition">How It Works</a>
          <a href="#about" className="hover:text-white transition">About</a>
        </nav>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-4 py-2 rounded-md transition"
        >
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Detect Retinal Diseases <br /> with <span className="text-emerald-400">AI Precision</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="max-w-2xl text-slate-400 text-lg mb-10"
        >
          Upload retinal images and get instant analysis for CNV, DME, Drusen, or Normal results — powered by deep learning.
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => navigate("/dashboard")}
          className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-md font-semibold text-lg transition"
        >
          Start Analyzing
        </motion.button>

        {/* Decorative gradient */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none" />
      </main>

      {/* Features Section */}
      <section id="features" className="px-8 py-16 bg-slate-900">
        <h3 className="text-2xl font-semibold mb-8 text-center">Why Choose RetinaVision?</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
          {[
            {
              title: "AI-Powered Detection",
              desc: "Advanced deep learning models trained on high-quality retinal datasets.",
            },
            {
              title: "Instant Results",
              desc: "Upload your image and get results within seconds, with detailed confidence scores.",
            },
            {
              title: "Secure & Private",
              desc: "Images never leave your secure session unless you choose to save results.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
            >
              <h4 className="text-lg font-bold text-emerald-400 mb-2">{f.title}</h4>
              <p className="text-slate-300 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-500 text-sm border-t border-slate-800">
        © {new Date().getFullYear()} RetinaVision — Built with ❤️ for better eye care.
      </footer>
    </div>
  );
}
