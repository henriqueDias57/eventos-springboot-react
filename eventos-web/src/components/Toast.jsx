import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl backdrop-blur-md border animate-fade-in ${
      isSuccess
        ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-950/50'
        : 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-950/50'
    }`}>
      {isSuccess ? <CheckCircle2 size={20} className="text-emerald-400 shrink-0" /> : <AlertTriangle size={20} className="text-rose-400 shrink-0" />}
      <span className="text-sm font-medium">{toast.message}</span>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-white transition-colors">
        <X size={16} />
      </button>
    </div>
  );
}
