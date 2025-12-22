import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import About from "./pages/About";
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";
import LandingPage from "./components/LandingPage"; 

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* App Layout for dashboard sections */}
        <Route
          path="/*"
          element={
            <div className="flex min-h-screen bg-[#0f172a] text-slate-100">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 p-6">
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="history" element={<History />} />
                    <Route path="about" element={<About />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
