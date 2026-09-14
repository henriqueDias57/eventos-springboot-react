import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { inscricaoService } from '../api/inscricaoService';
import { eventoService } from '../api/eventoService';
import { Plus, Edit3, Trash2, UserCheck, Mail, Calendar, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function Inscricoes({ showToast }) {
  const [inscricoes, setInscricoes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nomeParticipante: '',
    emailParticipante: '',
    status: 'CONFIRMADA',
    eventoId: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [regs, evts] = await Promise.all([
        inscricaoService.listarTodas(),
        eventoService.listarTodos(),
      ]);
      setInscricoes(regs);
      setEventos(evts);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (reg = null) => {
    setFormErrors({});
    if (reg) {
      setEditingId(reg.id);
      setFormData({
        nomeParticipante: reg.nomeParticipante,
        emailParticipante: reg.emailParticipante,
        status: reg.status || 'CONFIRMADA',
        eventoId: reg.eventoId ? reg.eventoId.toString() : '',
      });
    } else {
      setEditingId(null);
      setFormData({
        nomeParticipante: '',
        emailParticipante: '',
        status: 'CONFIRMADA',
        eventoId: eventos.length > 0 ? eventos[0].id.toString() : '',
      });
    }
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nomeParticipante.trim()) errors.nomeParticipante = 'O nome do participante é obrigatório.';
    if (!formData.emailParticipante.trim()) {
      errors.emailParticipante = 'O e-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(formData.emailParticipante)) {
      errors.emailParticipante = 'Formato de e-mail inválido.';
    }
    if (!formData.eventoId) errors.eventoId = 'Selecione um evento.';
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
        eventoId: parseInt(formData.eventoId),
      };

      if (editingId) {
        await inscricaoService.atualizar(editingId, payload);
        showToast('Inscrição atualizada com sucesso!', 'success');
      } else {
        await inscricaoService.salvar(payload);
        showToast('Nova inscrição realizada com sucesso!', 'success');
      }
      setIsModalOpen(false);
      carregarDados();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir/cancelar a inscrição de "${nome}"?`)) {
      try {
        await inscricaoService.deletar(id);
        showToast('Inscrição excluída com sucesso!', 'success');
        carregarDados();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  const filteredInscricoes = inscricoes.filter(r => {
    const matchSearch =
      r.nomeParticipante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.emailParticipante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.tituloEvento && r.tituloEvento.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchStatus = statusFilter === 'TODOS' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <Navbar title="Gerenciamento de Inscrições" subtitle="Inscrições de Participantes vinculadas a Eventos (N:1)" />

      {/* Action & Filter Bar */}
      <div className="glass-panel p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar participante, email ou evento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-full sm:w-64"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-full sm:w-44"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="CONFIRMADA">CONFIRMADA</option>
            <option value="PENDENTE">PENDENTE</option>
            <option value="CANCELADA">CANCELADA</option>
          </select>
        </div>

        <button onClick={() => handleOpenModal()} className="btn btn-primary w-full md:w-auto">
          <Plus size={18} />
          <span>Nova Inscrição</span>
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : (
        <div className="table-container glass-panel">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome do Participante</th>
                <th>E-mail</th>
                <th>Evento Pai (FK)</th>
                <th>Data Inscrição</th>
                <th>Status</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredInscricoes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400">
                    Nenhuma inscrição encontrada.
                  </td>
                </tr>
              ) : (
                filteredInscricoes.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="font-mono text-xs text-gray-400">#{reg.id}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <UserCheck size={16} className="text-purple-400" />
                        <span className="font-bold text-white">{reg.nomeParticipante}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 font-mono text-xs text-gray-300">
                        <Mail size={14} className="text-gray-500" />
                        <span>{reg.emailParticipante}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary flex items-center gap-1 w-fit">
                        <Calendar size={12} />
                        {reg.tituloEvento}
                      </span>
                    </td>
                    <td className="text-gray-300 font-mono text-xs">
                      {reg.dataInscricao ? new Date(reg.dataInscricao).toLocaleString('pt-BR') : '—'}
                    </td>
                    <td>
                      <span className={`badge ${
                        reg.status === 'CONFIRMADA' ? 'badge-success' : reg.status === 'PENDENTE' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {reg.status === 'CONFIRMADA' && <CheckCircle2 size={12} />}
                        {reg.status === 'PENDENTE' && <Clock size={12} />}
                        {reg.status === 'CANCELADA' && <XCircle size={12} />}
                        {reg.status}
                      </span>
                    </td>
                    <td className="text-right space-x-2">
                      <button onClick={() => handleOpenModal(reg)} className="btn btn-secondary btn-sm">
                        <Edit3 size={14} />
                        <span>Editar</span>
                      </button>
                      <button onClick={() => handleDelete(reg.id, reg.nomeParticipante)} className="btn btn-danger btn-sm">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
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
        title={editingId ? 'Editar Inscrição' : 'Cadastrar Nova Inscrição'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Nome Completo do Participante *</label>
            <input
              type="text"
              value={formData.nomeParticipante}
              onChange={(e) => setFormData({ ...formData, nomeParticipante: e.target.value })}
              placeholder="Ex: Ana Silva"
              className={`input-field ${formErrors.nomeParticipante ? 'border-rose-500' : ''}`}
            />
            {formErrors.nomeParticipante && <p className="text-xs text-rose-400 mt-1">{formErrors.nomeParticipante}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Endereço de E-mail *</label>
            <input
              type="email"
              value={formData.emailParticipante}
              onChange={(e) => setFormData({ ...formData, emailParticipante: e.target.value })}
              placeholder="Ex: ana.silva@email.com"
              className={`input-field ${formErrors.emailParticipante ? 'border-rose-500' : ''}`}
            />
            {formErrors.emailParticipante && <p className="text-xs text-rose-400 mt-1">{formErrors.emailParticipante}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Evento Pai (FK) *</label>
              <select
                value={formData.eventoId}
                onChange={(e) => setFormData({ ...formData, eventoId: e.target.value })}
                className={`input-field ${formErrors.eventoId ? 'border-rose-500' : ''}`}
              >
                <option value="">Selecione...</option>
                {eventos.map((e) => (
                  <option key={e.id} value={e.id.toString()}>
                    {e.titulo}
                  </option>
                ))}
              </select>
              {formErrors.eventoId && <p className="text-xs text-rose-400 mt-1">{formErrors.eventoId}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Status da Inscrição</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input-field"
              >
                <option value="CONFIRMADA">CONFIRMADA</option>
                <option value="PENDENTE">PENDENTE</option>
                <option value="CANCELADA">CANCELADA</option>
              </select>
            </div>
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
