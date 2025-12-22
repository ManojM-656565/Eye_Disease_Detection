import React from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, History, Info } from "lucide-react";

export default function Sidebar() {
  const linkClass =
    "flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors";
  const activeClass = "bg-slate-800 text-emerald-400 font-medium";

  return (
    <aside className="w-60 bg-slate-900 border-r border-slate-800 p-4 flex flex-col">
      <div className="text-xl font-bold mb-6 text-emerald-400">RetinaVision</div>
      <nav className="space-y-2 flex-1">
        <NavLink to="/dashboard" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
          <BarChart3 className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink to="/history" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
          <History className="w-5 h-5" />
          History
        </NavLink>

        <NavLink to="/about" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
          <Info className="w-5 h-5" />
          About
        </NavLink>
      </nav>

      <div className="mt-auto text-xs text-slate-500">© 2025 RetinaAI Labs</div>
    </aside>
  );
}
