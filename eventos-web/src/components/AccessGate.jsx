import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Alert, CircularProgress, InputAdornment, IconButton
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import KeyIcon from '@mui/icons-material/Key';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SecurityIcon from '@mui/icons-material/Security';
import { getStoredAccessKey, setStoredAccessKey, authApi } from '../api';

export default function AccessGate({ children }) {
  const [autenticado, setAutenticado] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  // Ao montar, verifica se já existe uma chave válida salva
  useEffect(() => {
    const chaveSalva = getStoredAccessKey();
    if (chaveSalva) {
      verificarChave(chaveSalva, false);
    } else {
      setVerificando(false);
    }

    const handleUnauthorized = () => {
      setAutenticado(false);
      setErro('Acesso bloqueado ou expirado. Digite a senha para continuar.');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const verificarChave = async (chaveParaTestar, mostrarErro = true) => {
    setCarregando(true);
    setErro('');
    try {
      await authApi.validarAcesso(chaveParaTestar);
      setStoredAccessKey(chaveParaTestar);
      setAutenticado(true);
    } catch (err) {
      setAutenticado(false);
      if (mostrarErro) {
        setErro('Senha de acesso incorreta. Verifique e tente novamente.');
      }
    } finally {
      setCarregando(false);
      setVerificando(false);
    }
  };

  const handleEntrar = (e) => {
    e.preventDefault();
    if (!senha.trim()) {
      setErro('Por favor, informe a senha de acesso.');
      return;
    }
    verificarChave(senha.trim(), true);
  };

  if (verificando) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F8FAFC' }}>
        <CircularProgress size={48} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (!autenticado) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#0F172A',
          p: 2,
        }}
      >
        <Card
          sx={{
            maxWidth: 440,
            width: '100%',
            p: 3,
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            bgcolor: '#1E293B',
            color: '#FFFFFF'
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: 0 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'rgba(99, 102, 241, 0.15)',
                color: '#818CF8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
              }}
            >
              <SecurityIcon sx={{ fontSize: 36 }} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#F8FAFC' }}>
              Acesso Restrito
            </Typography>

            <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
              Este sistema é privado e protegido por senha de infraestrutura. Digite sua chave de acesso para entrar.
            </Typography>

            {erro && (
              <Alert severity="error" sx={{ mb: 3, textAlign: 'left', bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5' }}>
                {erro}
              </Alert>
            )}

            <form onSubmit={handleEntrar}>
              <TextField
                fullWidth
                autoFocus
                type={mostrarSenha ? 'text' : 'password'}
                label="Senha de Acesso Mestra"
                variant="outlined"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={carregando}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: '#F8FAFC',
                    bgcolor: '#0F172A',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#6366F1' },
                    '&.Mui-focused fieldset': { borderColor: '#6366F1' },
                  },
                  '& .MuiInputLabel-root': { color: '#94A3B8' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#818CF8' },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon sx={{ color: '#64748B' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        edge="end"
                        sx={{ color: '#64748B' }}
                      >
                        {mostrarSenha ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={carregando}
                sx={{
                  bgcolor: '#4F46E5',
                  py: 1.4,
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#4338CA' },
                }}
              >
                {carregando ? <CircularProgress size={24} sx={{ color: '#FFF' }} /> : 'Desbloquear Acesso'}
              </Button>
            </form>

            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.8, color: '#64748B' }}>
              <LockOutlinedIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">Conexão Criptografada ponta a ponta</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return children;
}
