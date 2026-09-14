import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import Categorias from './pages/Categorias';
import Eventos from './pages/Eventos';
import Inscricoes from './pages/Inscricoes';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard showToast={showToast} />;
      case 'categorias':
        return <Categorias showToast={showToast} />;
      case 'eventos':
        return <Eventos showToast={showToast} />;
      case 'inscricoes':
        return <Inscricoes showToast={showToast} />;
      default:
        return <Dashboard showToast={showToast} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {renderPage()}
      </main>

      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
