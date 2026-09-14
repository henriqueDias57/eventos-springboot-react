import React from 'react';
import { Activity, ShieldCheck, Database } from 'lucide-react';

export default function Navbar({ title, subtitle }) {
  return (
    <header className="glass-panel px-6 py-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Activity size={14} className="animate-pulse" />
          <span>Backend Conectado</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Database size={14} />
          <span>PostgreSQL Active</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <ShieldCheck size={14} />
          <span>Perfil Acesso Livre</span>
        </div>
      </div>
    </header>
  );
}
