import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { categoriaService } from '../api/categoriaService';
import { eventoService } from '../api/eventoService';
import { Plus, Edit3, Trash2, ChevronDown, ChevronRight, Tag, Calendar, Layers } from 'lucide-react';

export default function Categorias({ showToast }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nome: '', descricao: '' });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // 1:N Expansion State
  const [expandedId, setExpandedId] = useState(null);
  const [childEvents, setChildEvents] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      setLoading(true);
      const data = await categoriaService.listarTodas();
      setCategorias(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setChildEvents([]);
    } else {
      setExpandedId(id);
      try {
        setLoadingChildren(true);
        const events = await eventoService.listarPorCategoria(id);
        setChildEvents(events);
      } catch (err) {
        showToast('Erro ao carregar eventos da categoria: ' + err.message, 'error');
      } finally {
        setLoadingChildren(false);
      }
    }
  };

  const handleOpenModal = (cat = null) => {
    setFormErrors({});
    if (cat) {
      setEditingId(cat.id);
      setFormData({ nome: cat.nome, descricao: cat.descricao || '' });
    } else {
      setEditingId(null);
      setFormData({ nome: '', descricao: '' });
    }
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nome.trim()) {
      errors.nome = 'O nome da categoria é obrigatório.';
    } else if (formData.nome.length > 100) {
      errors.nome = 'O nome deve ter no máximo 100 caracteres.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      if (editingId) {
        await categoriaService.atualizar(editingId, formData);
        showToast('Categoria atualizada com sucesso!', 'success');
      } else {
        await categoriaService.salvar(formData);
        showToast('Nova categoria cadastrada com sucesso!', 'success');
      }
      setIsModalOpen(false);
      carregarCategorias();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja excluir a categoria "${nome}"? Todos os eventos atrelados a ela serão deletados em cascata.`)) {
      try {
        await categoriaService.deletar(id);
        showToast('Categoria excluída com sucesso!', 'success');
        carregarCategorias();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  const filteredCategorias = categorias.filter(c =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.descricao && c.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <Navbar title="Gerenciamento de Categorias" subtitle="Entidade Pai no relacionamento 1:N com Eventos" />

      {/* Action Bar */}
      <div className="glass-panel p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>

        <button onClick={() => handleOpenModal()} className="btn btn-primary w-full sm:w-auto">
          <Plus size={18} />
          <span>Nova Categoria</span>
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
                <th>Nome da Categoria</th>
                <th>Descrição</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategorias.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    Nenhuma categoria encontrada.
                  </td>
                </tr>
              ) : (
                filteredCategorias.map((cat) => (
                  <React.Fragment key={cat.id}>
                    <tr className="hover:bg-gray-800/40 transition-colors">
                      <td>
                        <button
                          onClick={() => toggleExpand(cat.id)}
                          className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                          title="Expandir eventos associados (Relacionamento 1:N)"
                        >
                          {expandedId === cat.id ? <ChevronDown size={18} className="text-indigo-400" /> : <ChevronRight size={18} />}
                        </button>
                      </td>
                      <td className="font-mono text-xs text-gray-400">#{cat.id}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Tag size={16} className="text-indigo-400" />
                          <span className="font-bold text-white">{cat.nome}</span>
                        </div>
                      </td>
                      <td className="text-gray-300 max-w-md truncate">{cat.descricao || '—'}</td>
                      <td className="text-right space-x-2">
                        <button
                          onClick={() => handleOpenModal(cat)}
                          className="btn btn-secondary btn-sm"
                          title="Editar Categoria"
                        >
                          <Edit3 size={14} />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.nome)}
                          className="btn btn-danger btn-sm"
                          title="Excluir Categoria"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>

                    {/* 1:N Relationship Nested Details Row */}
                    {expandedId === cat.id && (
                      <tr className="bg-indigo-950/30">
                        <td colSpan="5" className="p-4 border-b border-indigo-900/50">
                          <div className="pl-6 border-l-2 border-indigo-500 space-y-3">
                            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                              <Layers size={14} />
                              <span>Registros Filhos Associados (Relacionamento 1:N - Eventos desta Categoria)</span>
                            </div>

                            {loadingChildren ? (
                              <p className="text-xs text-gray-400 italic">Carregando eventos associados...</p>
                            ) : childEvents.length === 0 ? (
                              <p className="text-xs text-gray-400 italic">Nenhum evento associado a esta categoria ainda.</p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                                {childEvents.map((evt) => (
                                  <div key={evt.id} className="glass-card p-3 rounded-xl border-indigo-500/20 text-xs space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-white flex items-center gap-1.5">
                                        <Calendar size={14} className="text-cyan-400" />
                                        {evt.titulo}
                                      </span>
                                      <span className="font-mono text-[10px] text-gray-400">#{evt.id}</span>
                                    </div>
                                    <p className="text-gray-400 text-[11px]">{evt.localEvento}</p>
                                    <p className="font-mono text-emerald-400 font-semibold">
                                      R$ {(evt.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </p>
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
        title={editingId ? 'Editar Categoria' : 'Cadastrar Nova Categoria'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Nome da Categoria *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Tecnologia, Workshop, Cultura"
              className={`input-field ${formErrors.nome ? 'border-rose-500' : ''}`}
            />
            {formErrors.nome && <p className="text-xs text-rose-400 mt-1">{formErrors.nome}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Descrição</label>
            <textarea
              rows="3"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva brevemente o propósito desta categoria..."
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
