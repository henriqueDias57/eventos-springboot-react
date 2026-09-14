import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Skeleton, Chip,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import EventIcon from '@mui/icons-material/Event';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useNavigate } from 'react-router-dom';
import { categoriaApi, eventoApi, inscricaoApi, relatorioApi } from '../api';

function StatCard({ icon, label, value, color, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        '&:hover': onClick ? { transform: 'translateY(-4px)', boxShadow: 4 } : {},
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '0.85rem' }}>
              {label}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: color || 'text.primary' }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{
            width: 56, height: 56, borderRadius: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: `${color}15`, color: color,
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [catRes, evtRes, inscRes, relRes] = await Promise.all([
          categoriaApi.listar(),
          eventoApi.listar(),
          inscricaoApi.listar(),
          relatorioApi.agregacaoCategoria(),
        ]);

        const faturamento = relRes.data.reduce(
          (sum, r) => sum + (parseFloat(r.faturamentoEstimado) || 0), 0
        );

        setStats({
          categorias: catRes.data.length,
          eventos: evtRes.data.length,
          inscricoes: inscRes.data.length,
          faturamento,
        });
      } catch {
        setStats({ categorias: 0, eventos: 0, inscricoes: 0, faturamento: 0 });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <Box>
        <Skeleton variant="text" width={300} height={50} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Bem-vindo ao Gerenciador de Eventos
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600 }}>
          Aqui você pode cadastrar categorias, criar eventos e gerenciar as inscrições dos participantes.
          Use o menu lateral para navegar entre as seções.
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CategoryIcon fontSize="large" />}
            label="Categorias"
            value={stats.categorias}
            color="#6366F1"
            onClick={() => navigate('/categorias')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<EventIcon fontSize="large" />}
            label="Eventos"
            value={stats.eventos}
            color="#F59E0B"
            onClick={() => navigate('/eventos')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PersonAddIcon fontSize="large" />}
            label="Inscrições"
            value={stats.inscricoes}
            color="#10B981"
            onClick={() => navigate('/inscricoes')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingUpIcon fontSize="large" />}
            label="Faturamento Estimado"
            value={`R$ ${stats.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            color="#8B5CF6"
          />
        </Grid>
      </Grid>

      {/* Quick actions */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Como usar o sistema</Typography>
          <Box component="ol" sx={{ pl: 2.5, color: 'text.secondary', '& li': { mb: 1.5, fontSize: '0.95rem' } }}>
            <li>
              <strong>Categorias:</strong> Comece criando as categorias dos seus eventos (ex: "Workshop", "Palestra", "Conferência").
            </li>
            <li>
              <strong>Eventos:</strong> Depois, crie os eventos dentro de cada categoria, com data, local e preço.
            </li>
            <li>
              <strong>Inscrições:</strong> Registre os participantes em cada evento, informando nome e e-mail.
            </li>
            <li>
              <strong>Relatórios:</strong> Acompanhe os números consolidados — inscrições por categoria, faturamento estimado e mais.
            </li>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
