import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Card, CardContent, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Tooltip, CircularProgress, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { categoriaApi } from '../api';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';

const emptyForm = { nome: '', descricao: '' };

export default function Categorias({ showToast }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await categoriaApi.listar();
      setCategorias(res.data);
    } catch (err) {
      showToast(err.mensagem || 'Erro ao carregar categorias.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
    setDialogOpen(true);
  };

  const openEdit = (cat) => {
    setForm({ nome: cat.nome, descricao: cat.descricao || '' });
    setEditingId(cat.id);
    setErrors({});
    setDialogOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Preencha o nome da categoria.';
    if (form.nome.length > 100) e.nome = 'O nome não pode exceder 100 caracteres.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editingId) {
        await categoriaApi.atualizar(editingId, form);
        showToast('Categoria atualizada com sucesso!');
      } else {
        await categoriaApi.criar(form);
        showToast('Categoria criada com sucesso!');
      }
      setDialogOpen(false);
      loadData();
    } catch (err) {
      showToast(err.mensagem || 'Erro ao salvar categoria.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await categoriaApi.deletar(confirmDelete);
      showToast('Categoria removida com sucesso!');
      setConfirmDelete(null);
      loadData();
    } catch (err) {
      showToast(err.mensagem || 'Não foi possível remover. Verifique se há eventos vinculados.', 'error');
      setConfirmDelete(null);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4">Categorias</Typography>
          <Typography variant="body2" color="text.secondary">
            Organize seus eventos por tipo — ex: Workshop, Palestra, Conferência
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>
          Nova Categoria
        </Button>
      </Box>

      {/* Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : categorias.length === 0 ? (
        <Card>
          <EmptyState
            title="Nenhuma categoria cadastrada"
            description="Crie a primeira categoria para começar a organizar seus eventos."
            actionLabel="Criar Categoria"
            onAction={openNew}
          />
        </Card>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell align="right" width={120}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categorias.map((cat) => (
                  <TableRow key={cat.id} hover>
                    <TableCell>
                      <Typography fontWeight={500}>{cat.nome}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {cat.descricao || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => openEdit(cat)} color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remover">
                        <IconButton size="small" onClick={() => setConfirmDelete(cat.id)} color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <TextField
            label="Nome da Categoria"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            error={!!errors.nome}
            helperText={errors.nome}
            sx={{ mb: 2.5 }}
            autoFocus
          />
          <TextField
            label="Descrição (opcional)"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={22} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Remover Categoria"
        message="Tem certeza que deseja remover esta categoria? Eventos vinculados a ela também podem ser afetados."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </Box>
  );
}
