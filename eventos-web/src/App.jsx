import React, { useState, useCallback } from 'react';
import { ThemeProvider, CssBaseline, Snackbar, Alert } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import theme from './theme';
import Layout from './components/Layout';
import AccessGate from './components/AccessGate';
import Dashboard from './pages/Dashboard';
import Categorias from './pages/Categorias';
import Eventos from './pages/Eventos';
import Inscricoes from './pages/Inscricoes';
import Relatorios from './pages/Relatorios';

export default function App() {
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const showToast = useCallback((message, severity = 'success') => {
    setToast({ open: true, message, severity });
  }, []);

  const closeToast = () => setToast((prev) => ({ ...prev, open: false }));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AccessGate>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/categorias" element={<Categorias showToast={showToast} />} />
              <Route path="/eventos" element={<Eventos showToast={showToast} />} />
              <Route path="/inscricoes" element={<Inscricoes showToast={showToast} />} />
              <Route path="/relatorios" element={<Relatorios />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AccessGate>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={closeToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeToast} severity={toast.severity} variant="filled" sx={{ width: '100%', borderRadius: 3 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
