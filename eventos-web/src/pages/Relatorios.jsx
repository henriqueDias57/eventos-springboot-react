import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, CircularProgress, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { relatorioApi } from '../api';
import EmptyState from '../components/EmptyState';

const COLORS = ['#6366F1', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

function formatCurrency(val) {
  const n = parseFloat(val);
  if (isNaN(n)) return 'R$ 0,00';
  return `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Relatorios() {
  const [agregacao, setAgregacao] = useState([]);
  const [estatisticas, setEstatisticas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [agrRes, estRes] = await Promise.all([
          relatorioApi.agregacaoCategoria(),
          relatorioApi.estatisticasEventos(),
        ]);
        setAgregacao(agrRes.data);
        setEstatisticas(estRes.data);
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
    );
  }

  const totalInscricoes = agregacao.reduce((s, r) => s + (r.totalInscricoes || 0), 0);
  const totalEventos = agregacao.reduce((s, r) => s + (r.totalEventos || 0), 0);
  const totalFaturamento = agregacao.reduce((s, r) => s + (parseFloat(r.faturamentoEstimado) || 0), 0);

  const pieData = agregacao
    .filter((r) => r.totalInscricoes > 0)
    .map((r) => ({ name: r.nomeCategoria, value: r.totalInscricoes }));

  const barData = agregacao.map((r) => ({
    nome: r.nomeCategoria,
    eventos: r.totalEventos || 0,
    inscricoes: r.totalInscricoes || 0,
    faturamento: parseFloat(r.faturamentoEstimado) || 0,
  }));

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">Relatórios</Typography>
        <Typography variant="body2" color="text.secondary">
          Visão consolidada dos dados — gerado automaticamente a partir do banco de dados
        </Typography>
      </Box>

      {/* Summary cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ textAlign: 'center', bgcolor: '#6366F1', color: '#FFF' }}>
            <CardContent sx={{ py: 3 }}>
              <Typography variant="h3" fontWeight={700}>{totalEventos}</Typography>
              <Typography variant="body1" sx={{ opacity: 0.85 }}>Total de Eventos</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ textAlign: 'center', bgcolor: '#10B981', color: '#FFF' }}>
            <CardContent sx={{ py: 3 }}>
              <Typography variant="h3" fontWeight={700}>{totalInscricoes}</Typography>
              <Typography variant="body1" sx={{ opacity: 0.85 }}>Total de Inscrições</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ textAlign: 'center', bgcolor: '#8B5CF6', color: '#FFF' }}>
            <CardContent sx={{ py: 3 }}>
              <Typography variant="h3" fontWeight={700}>{formatCurrency(totalFaturamento)}</Typography>
              <Typography variant="body1" sx={{ opacity: 0.85 }}>Faturamento Estimado</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {agregacao.length === 0 ? (
        <Card>
          <EmptyState
            title="Sem dados para exibir"
            description="Cadastre categorias, eventos e inscrições para que os relatórios sejam gerados."
          />
        </Card>
      ) : (
        <>
          {/* Bar Chart - Eventos e Inscrições por Categoria */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={7}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>Eventos e Inscrições por Categoria</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                      <ReTooltip
                        contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="eventos" fill="#6366F1" name="Eventos" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="inscricoes" fill="#10B981" name="Inscrições" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Pie Chart - Inscrições por Categoria */}
            <Grid item xs={12} md={5}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>Distribuição de Inscrições</Typography>
                  {pieData.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 6 }}>
                      Nenhuma inscrição registrada ainda
                    </Typography>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={4}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <ReTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Table - Agregação por Categoria (Native Query) */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 0.5 }}>Detalhamento por Categoria</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                Dados gerados por consulta nativa SQL (Native Query) com COUNT, SUM e GROUP BY
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Categoria</TableCell>
                      <TableCell align="center">Eventos</TableCell>
                      <TableCell align="center">Inscrições</TableCell>
                      <TableCell align="right">Faturamento Estimado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agregacao.map((r) => (
                      <TableRow key={r.categoriaId} hover>
                        <TableCell>
                          <Typography fontWeight={500}>{r.nomeCategoria}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={r.totalEventos} size="small" color="primary" variant="outlined" />
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={r.totalInscricoes} size="small" color="success" variant="outlined" />
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={600} color="primary.main">
                            {formatCurrency(r.faturamentoEstimado)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Table - Estatísticas por Evento */}
          {estatisticas.length > 0 && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 0.5 }}>Estatísticas por Evento</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                  Dados gerados por consulta nativa SQL com COUNT, AVG e GROUP BY
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Evento</TableCell>
                        <TableCell align="center">Total de Inscritos</TableCell>
                        <TableCell align="center">Confirmados</TableCell>
                        <TableCell align="right">Preço Médio</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {estatisticas.map((e) => (
                        <TableRow key={e.eventoId} hover>
                          <TableCell>
                            <Typography fontWeight={500}>{e.tituloEvento}</Typography>
                          </TableCell>
                          <TableCell align="center">{e.totalInscritos}</TableCell>
                          <TableCell align="center">
                            <Chip label={e.inscricaoConfirmada} size="small" color="success" />
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(e.precoMedio)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
}
