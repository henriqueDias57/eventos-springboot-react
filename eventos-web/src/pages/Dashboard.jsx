import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { relatorioService } from '../api/relatorioService';
import { Tag, Calendar, UserCheck, DollarSign, Database, TrendingUp, BarChart3, Layers } from 'lucide-react';

export default function Dashboard() {
  const [agregacaoCategoria, setAgregacaoCategoria] = useState([]);
  const [estatisticasEventos, setEstatisticasEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  const carregarDadosDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const [catData, evtData] = await Promise.all([
        relatorioService.obterAgregacaoCategoria(),
        relatorioService.obterEstatisticasEventos(),
      ]);
      setAgregacaoCategoria(catData);
      setEstatisticasEventos(evtData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalEventos = agregacaoCategoria.reduce((acc, item) => acc + (item.totalEventos || 0), 0);
  const totalInscricoes = agregacaoCategoria.reduce((acc, item) => acc + (item.totalInscricoes || 0), 0);
  const faturamentoTotal = agregacaoCategoria.reduce((acc, item) => acc + (item.faturamentoEstimado || 0), 0);

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <Navbar
        title="Dashboard & Métricas Agregadas"
        subtitle="Visão geral do sistema e relatórios gerados via Native Query em SQL Puro no PostgreSQL"
      />

      {error && (
        <div className="p-4 mb-6 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-sm flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={carregarDadosDashboard} className="btn btn-secondary btn-sm">Tentar Novamente</button>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <div className="space-y-6">
          {/* Top Indicator Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total de Categorias"
              value={agregacaoCategoria.length}
              subtitle="Categorias ativas"
              icon={Tag}
              color="indigo"
            />
            <StatCard
              title="Total de Eventos"
              value={totalEventos}
              subtitle="Eventos agendados"
              icon={Calendar}
              color="cyan"
            />
            <StatCard
              title="Total de Inscrições"
              value={totalInscricoes}
              subtitle="Participantes registrados"
              icon={UserCheck}
              color="purple"
            />
            <StatCard
              title="Faturamento Estimado"
              value={`R$ ${faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              subtitle="Baseado no preço dos eventos"
              icon={DollarSign}
              color="emerald"
            />
          </div>

          {/* Destasque Requisito Obrigatório - Native Query Aggregation */}
          <div className="glass-panel p-6 border-indigo-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge badge-primary">Requisito Obrigatório</span>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <Database size={20} className="text-indigo-400" />
                    Agregação Native Query SQL (Categorias)
                  </h3>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Consulta SQL nativa PostgreSQL (<code className="text-indigo-300">@Query(nativeQuery = true)</code>) executando <code className="text-indigo-300">COUNT</code>, <code className="text-indigo-300">SUM</code>, <code className="text-indigo-300">COALESCE</code>, <code className="text-indigo-300">LEFT JOIN</code> e <code className="text-indigo-300">GROUP BY</code>.
                </p>
              </div>

              <div className="text-right text-xs text-gray-400">
                <span>Total Mapeado: <strong className="text-white">{agregacaoCategoria.length} Categorias</strong></span>
              </div>
            </div>

            {/* Custom Table for Native Query Categories */}
            <div className="table-container mb-6">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Categoria</th>
                    <th className="text-center">Total de Eventos</th>
                    <th className="text-center">Total de Inscrições</th>
                    <th className="text-right">Faturamento Estimado</th>
                    <th>Participação Visuall</th>
                  </tr>
                </thead>
                <tbody>
                  {agregacaoCategoria.map((cat) => {
                    const pct = totalInscricoes > 0 ? ((cat.totalInscricoes / totalInscricoes) * 100).toFixed(0) : 0;
                    return (
                      <tr key={cat.categoriaId}>
                        <td><span className="font-mono text-xs text-gray-400">#{cat.categoriaId}</span></td>
                        <td>
                          <span className="font-semibold text-white">{cat.nomeCategoria}</span>
                        </td>
                        <td className="text-center">
                          <span className="badge badge-primary">{cat.totalEventos} Eventos</span>
                        </td>
                        <td className="text-center">
                          <span className="badge badge-success">{cat.totalInscricoes} Inscrições</span>
                        </td>
                        <td className="text-right font-mono font-semibold text-emerald-400">
                          R$ {(cat.faturamentoEstimado || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ width: '200px' }}>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-400 font-mono">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Event Statistics Native Query Table */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 size={18} className="text-cyan-400" />
                Estatísticas Individuais por Evento (SQL Puro)
              </h3>
              <span className="text-xs text-gray-400">
                Agregação com <code className="text-cyan-300">SUM(CASE)</code> e <code className="text-cyan-300">AVG</code>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {estatisticasEventos.map((evt) => (
                <div key={evt.eventoId} className="glass-card p-4 rounded-xl space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-sm text-white line-clamp-1">{evt.tituloEvento}</h4>
                    <span className="text-xs font-mono text-cyan-400">#{evt.eventoId}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                      <span className="text-gray-400 block">Total Inscritos</span>
                      <strong className="text-white text-sm">{evt.totalInscritos}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                      <span className="text-gray-400 block">Confirmadas</span>
                      <strong className="text-emerald-400 text-sm">{evt.inscricaoConfirmada || 0}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-xs">
                    <span className="text-gray-400">Preço Médio Evento:</span>
                    <strong className="text-white font-mono">
                      R$ {(evt.precoMedio || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
