import React from 'react';
import { LayoutDashboard, Tag, Calendar, UserCheck, Database, Server } from 'lucide-react';

export default function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard & Métricas', icon: LayoutDashboard },
    { id: 'categorias', label: 'Categorias', icon: Tag },
    { id: 'eventos', label: 'Eventos', icon: Calendar },
    { id: 'inscricoes', label: 'Inscrições', icon: UserCheck },
  ];

  return (
    <aside style={{ width: '260px', flexShrink: 0 }} className="glass-panel min-h-screen p-5 flex flex-col justify-between m-3">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-gray-800">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-xl shadow-lg shadow-indigo-500/20">
            🎪
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-wide">Eventos Web</h1>
            <p className="text-xs text-indigo-400 font-medium">Spring Boot + React</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Database System Footnote */}
      <div className="p-4 glass-card rounded-xl border border-gray-800/80 text-xs text-gray-400 space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold">
          <Database size={14} />
          <span>PostgreSQL 18</span>
        </div>
        <p className="text-[11px] text-gray-500">Conectado via JPA / Hibernate Native Queries em SQL Puro.</p>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 pt-1">
          <Server size={12} strokeWidth={2.5} />
          <span>API REST em localhost:8080</span>
        </div>
      </div>
    </aside>
  );
}
