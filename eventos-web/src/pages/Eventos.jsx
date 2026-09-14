import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { eventoService } from '../api/eventoService';
import { categoriaService } from '../api/categoriaService';
import { inscricaoService } from '../api/inscricaoService';
import { Plus, Edit3, Trash2, ChevronDown, ChevronRight, Calendar, MapPin, Tag, UserCheck, Layers } from 'lucide-react';

export default function Eventos({ showToast }) {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    dataEvento: '',
    localEvento: '',
    preco: '0.00',
    categoriaId: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // 1:N Expansion State (Child Registrations)
  const [expandedId, setExpandedId] = useState(null);
  const [childRegistrations, setChildRegistrations] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [evts, cats] = await Promise.all([
        eventoService.listarTodos(),
        categoriaService.listarTodas(),
      ]);
      setEventos(evts);
      setCategorias(cats);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setChildRegistrations([]);
    } else {
      setExpandedId(id);
      try {
        setLoadingChildren(true);
        const regs = await inscricaoService.listarPorEvento(id);
        setChildRegistrations(regs);
      } catch (err) {
        showToast('Erro ao carregar inscrições do evento: ' + err.message, 'error');
      } finally {
        setLoadingChildren(false);
      }
    }
  };

  const handleOpenModal = (evt = null) => {
    setFormErrors({});
    if (evt) {
      setEditingId(evt.id);
      // Format local datetime string for input datetime-local
      const dt = evt.dataEvento ? new Date(evt.dataEvento).toISOString().slice(0, 16) : '';
      setFormData({
        titulo: evt.titulo,
        descricao: evt.descricao || '',
        dataEvento: dt,
        localEvento: evt.localEvento,
        preco: evt.preco ? evt.preco.toString() : '0.00',
        categoriaId: evt.categoriaId ? evt.categoriaId.toString() : '',
      });
    } else {
      setEditingId(null);
      setFormData({
        titulo: '',
        descricao: '',
        dataEvento: new Date().toISOString().slice(0, 16),
        localEvento: '',
        preco: '0.00',
        categoriaId: categorias.length > 0 ? categorias[0].id.toString() : '',
      });
    }
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.titulo.trim()) errors.titulo = 'O título do evento é obrigatório.';
    if (!formData.dataEvento) errors.dataEvento = 'A data do evento é obrigatória.';
    if (!formData.localEvento.trim()) errors.localEvento = 'O local do evento é obrigatório.';
    if (!formData.categoriaId) errors.categoriaId = 'Selecione uma categoria.';
    if (formData.preco === '' || isNaN(formData.preco) || parseFloat(formData.preco) < 0) {
      errors.preco = 'Forneça um preço válido maior ou igual a 0.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      const payload = {
        ...formData,
        preco: parseFloat(formData.preco),
        categoriaId: parseInt(formData.categoriaId),
      };

      if (editingId) {
        await eventoService.atualizar(editingId, payload);
        showToast('Evento atualizado com sucesso!', 'success');
      } else {
        await eventoService.salvar(payload);
        showToast('Novo evento cadastrado com sucesso!', 'success');
      }
      setIsModalOpen(false);
      carregarDados();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, titulo) => {
    if (window.confirm(`Tem certeza que deseja excluir o evento "${titulo}"? As inscrições atreladas a ele serão deletadas.`)) {
      try {
        await eventoService.deletar(id);
        showToast('Evento excluído com sucesso!', 'success');
        carregarDados();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  const filteredEventos = eventos.filter(e =>
    e.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.localEvento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.nomeCategoria && e.nomeCategoria.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <Navbar title="Gerenciamento de Eventos" subtitle="Entidade central vinculada a Categoria (N:1) e Inscrições (1:N)" />

      {/* Action Bar */}
      <div className="glass-panel p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar por título, local ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>

        <button onClick={() => handleOpenModal()} className="btn btn-primary w-full sm:w-auto">
          <Plus size={18} />
          <span>Novo Evento</span>
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : (
        <div className="table-container glass-panel">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>ID</th>
                <th>Título do Evento</th>
                <th>Categoria Pai (N:1)</th>
                <th>Data & Hora</th>
                <th>Local</th>
                <th className="text-right">Preço</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredEventos.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-400">
                    Nenhum evento encontrado.
                  </td>
                </tr>
              ) : (
                filteredEventos.map((evt) => (
                  <React.Fragment key={evt.id}>
                    <tr className="hover:bg-gray-800/40 transition-colors">
                      <td>
                        <button
                          onClick={() => toggleExpand(evt.id)}
                          className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                          title="Expandir inscrições de participantes (Relacionamento 1:N)"
                        >
                          {expandedId === evt.id ? <ChevronDown size={18} className="text-cyan-400" /> : <ChevronRight size={18} />}
                        </button>
                      </td>
                      <td className="font-mono text-xs text-gray-400">#{evt.id}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-cyan-400" />
                          <span className="font-bold text-white">{evt.titulo}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary flex items-center gap-1 w-fit">
                          <Tag size={12} />
                          {evt.nomeCategoria}
                        </span>
                      </td>
                      <td className="text-gray-300 font-mono text-xs">
                        {evt.dataEvento ? new Date(evt.dataEvento).toLocaleString('pt-BR') : '—'}
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5 text-xs text-gray-300">
                          <MapPin size={14} className="text-gray-500" />
                          <span>{evt.localEvento}</span>
                        </div>
                      </td>
                      <td className="text-right font-mono font-bold text-emerald-400">
                        {evt.preco === 0 ? (
                          <span className="badge badge-success">GRATUITO</span>
                        ) : (
                          `R$ ${(evt.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        )}
                      </td>
                      <td className="text-right space-x-2">
                        <button onClick={() => handleOpenModal(evt)} className="btn btn-secondary btn-sm">
                          <Edit3 size={14} />
                          <span>Editar</span>
                        </button>
                        <button onClick={() => handleDelete(evt.id, evt.titulo)} className="btn btn-danger btn-sm">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>

                    {/* 1:N Relationship Nested Details Row */}
                    {expandedId === evt.id && (
                      <tr className="bg-cyan-950/20">
                        <td colSpan="8" className="p-4 border-b border-cyan-900/40">
                          <div className="pl-6 border-l-2 border-cyan-500 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300 uppercase tracking-wider">
                              <Layers size={14} />
                              <span>Inscrições Filhas Associadas (Relacionamento 1:N - Participantes Inscritos neste Evento)</span>
                            </div>

                            {loadingChildren ? (
                              <p className="text-xs text-gray-400 italic">Carregando inscrições...</p>
                            ) : childRegistrations.length === 0 ? (
                              <p className="text-xs text-gray-400 italic">Nenhum participante inscrito neste evento ainda.</p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                                {childRegistrations.map((reg) => (
                                  <div key={reg.id} className="glass-card p-3 rounded-xl border-cyan-500/20 text-xs space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-white flex items-center gap-1.5">
                                        <UserCheck size={14} className="text-emerald-400" />
                                        {reg.nomeParticipante}
                                      </span>
                                      <span className={`badge ${reg.status === 'CONFIRMADA' ? 'badge-success' : reg.status === 'PENDENTE' ? 'badge-warning' : 'badge-danger'}`}>
                                        {reg.status}
                                      </span>
                                    </div>
                                    <p className="text-gray-400 font-mono text-[11px]">{reg.emailParticipante}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CRUD Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Editar Evento' : 'Cadastrar Novo Evento'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Título do Evento *</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ex: Summit de Inteligência Artificial 2026"
              className={`input-field ${formErrors.titulo ? 'border-rose-500' : ''}`}
            />
            {formErrors.titulo && <p className="text-xs text-rose-400 mt-1">{formErrors.titulo}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Categoria Pai (FK) *</label>
              <select
                value={formData.categoriaId}
                onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                className={`input-field ${formErrors.categoriaId ? 'border-rose-500' : ''}`}
              >
                <option value="">Selecione...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id.toString()}>
                    {c.nome}
                  </option>
                ))}
              </select>
              {formErrors.categoriaId && <p className="text-xs text-rose-400 mt-1">{formErrors.categoriaId}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Preço (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.preco}
                onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                className={`input-field ${formErrors.preco ? 'border-rose-500' : ''}`}
              />
              {formErrors.preco && <p className="text-xs text-rose-400 mt-1">{formErrors.preco}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Data & Hora *</label>
              <input
                type="datetime-local"
                value={formData.dataEvento}
                onChange={(e) => setFormData({ ...formData, dataEvento: e.target.value })}
                className={`input-field ${formErrors.dataEvento ? 'border-rose-500' : ''}`}
              />
              {formErrors.dataEvento && <p className="text-xs text-rose-400 mt-1">{formErrors.dataEvento}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Local do Evento *</label>
              <input
                type="text"
                value={formData.localEvento}
                onChange={(e) => setFormData({ ...formData, localEvento: e.target.value })}
                placeholder="Ex: Centro de Convenções Tech, SP"
                className={`input-field ${formErrors.localEvento ? 'border-rose-500' : ''}`}
              />
              {formErrors.localEvento && <p className="text-xs text-rose-400 mt-1">{formErrors.localEvento}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Descrição</label>
            <textarea
              rows="3"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Detalhes sobre palestrantes, tópicos e agenda..."
              className="input-field"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Salvando...' : editingId ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
