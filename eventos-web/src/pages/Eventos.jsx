import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Card, CardContent, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Tooltip, CircularProgress, Chip, Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaceIcon from '@mui/icons-material/Place';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { eventoApi, categoriaApi } from '../api';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';

const emptyForm = { titulo: '', descricao: '', dataEvento: '', localEvento: '', preco: '', categoriaId: '' };

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatCurrency(val) {
  const n = parseFloat(val);
  if (isNaN(n)) return 'R$ 0,00';
  return `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Eventos({ showToast }) {
  const [eventos, setEventos] = useState([]);
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
      const [evtRes, catRes] = await Promise.all([eventoApi.listar(), categoriaApi.listar()]);
      setEventos(evtRes.data);
      setCategorias(catRes.data);
    } catch (err) {
      showToast(err.mensagem || 'Erro ao carregar eventos.', 'error');
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

  const openEdit = (evt) => {
    const dt = evt.dataEvento ? evt.dataEvento.substring(0, 16) : '';
    setForm({
      titulo: evt.titulo,
      descricao: evt.descricao || '',
      dataEvento: dt,
      localEvento: evt.localEvento,
      preco: evt.preco?.toString() || '0',
      categoriaId: evt.categoriaId?.toString() || '',
    });
    setEditingId(evt.id);
    setErrors({});
    setDialogOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.titulo.trim()) e.titulo = 'Preencha o título do evento.';
    if (!form.dataEvento) e.dataEvento = 'Selecione a data e hora.';
    if (!form.localEvento.trim()) e.localEvento = 'Informe o local do evento.';
    if (!form.preco && form.preco !== '0') e.preco = 'Informe o preço (use 0 para gratuito).';
    if (parseFloat(form.preco) < 0) e.preco = 'O preço não pode ser negativo.';
    if (!form.categoriaId) e.categoriaId = 'Selecione uma categoria.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        preco: parseFloat(form.preco),
        categoriaId: parseInt(form.categoriaId),
        dataEvento: form.dataEvento + ':00',
      };
      if (editingId) {
        await eventoApi.atualizar(editingId, payload);
        showToast('Evento atualizado com sucesso!');
      } else {
        await eventoApi.criar(payload);
        showToast('Evento criado com sucesso!');
      }
      setDialogOpen(false);
      loadData();
    } catch (err) {
      showToast(err.mensagem || 'Erro ao salvar evento.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await eventoApi.deletar(confirmDelete);
      showToast('Evento removido com sucesso!');
      setConfirmDelete(null);
      loadData();
    } catch (err) {
      showToast(err.mensagem || 'Não foi possível remover. Verifique se há inscrições vinculadas.', 'error');
      setConfirmDelete(null);
    }
  };

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4">Eventos</Typography>
          <Typography variant="body2" color="text.secondary">
            Crie e gerencie seus eventos — cada evento pertence a uma categoria
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>
          Novo Evento
        </Button>
      </Box>

      {/* Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : eventos.length === 0 ? (
        <Card>
          <EmptyState
            title="Nenhum evento cadastrado"
            description="Crie o primeiro evento — lembre-se de cadastrar pelo menos uma categoria antes."
            actionLabel="Criar Evento"
            onAction={openNew}
          />
        </Card>
      ) : (
        <Grid container spacing={2}>
          {eventos.map((evt) => (
            <Grid item xs={12} sm={6} lg={4} key={evt.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1, pr: 1 }}>
                      {evt.titulo}
                    </Typography>
                    <Chip
                      label={evt.nomeCategoria || 'Sem categoria'}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>

                  {evt.descricao && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
                      {evt.descricao}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, color: 'text.secondary' }}>
                    <CalendarMonthIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2">{formatDate(evt.dataEvento)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2, color: 'text.secondary' }}>
                    <PlaceIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2">{evt.localEvento}</Typography>
                  </Box>

                  <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 700 }}>
                    {parseFloat(evt.preco) === 0 ? 'Gratuito' : formatCurrency(evt.preco)}
                  </Typography>
                </CardContent>

                <Box sx={{ px: 2, pb: 2, display: 'flex', gap: 1 }}>
                  <Button size="small" startIcon={<EditIcon />} onClick={() => openEdit(evt)} fullWidth variant="outlined">
                    Editar
                  </Button>
                  <Button size="small" startIcon={<DeleteIcon />} onClick={() => setConfirmDelete(evt.id)} fullWidth color="error" variant="outlined">
                    Remover
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Editar Evento' : 'Novo Evento'}</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <TextField
            label="Título do Evento"
            value={form.titulo}
            onChange={(e) => setField('titulo', e.target.value)}
            error={!!errors.titulo}
            helperText={errors.titulo}
            sx={{ mb: 2.5 }}
            autoFocus
          />
          <TextField
            label="Descrição (opcional)"
            value={form.descricao}
            onChange={(e) => setField('descricao', e.target.value)}
            multiline
            rows={2}
            sx={{ mb: 2.5 }}
          />
          <TextField
            label="Categoria"
            value={form.categoriaId}
            onChange={(e) => setField('categoriaId', e.target.value)}
            error={!!errors.categoriaId}
            helperText={errors.categoriaId || (categorias.length === 0 ? 'Cadastre uma categoria primeiro.' : '')}
            select
            sx={{ mb: 2.5 }}
          >
            {categorias.map((cat) => (
              <MenuItem key={cat.id} value={cat.id.toString()}>
                {cat.nome}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Data e Hora"
            type="datetime-local"
            value={form.dataEvento}
            onChange={(e) => setField('dataEvento', e.target.value)}
            error={!!errors.dataEvento}
            helperText={errors.dataEvento}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2.5 }}
          />
          <TextField
            label="Local do Evento"
            value={form.localEvento}
            onChange={(e) => setField('localEvento', e.target.value)}
            error={!!errors.localEvento}
            helperText={errors.localEvento}
            sx={{ mb: 2.5 }}
          />
          <TextField
            label="Preço (R$)"
            type="number"
            value={form.preco}
            onChange={(e) => setField('preco', e.target.value)}
            error={!!errors.preco}
            helperText={errors.preco || 'Use 0 para evento gratuito'}
            inputProps={{ min: 0, step: '0.01' }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={22} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Remover Evento"
        message="Tem certeza que deseja remover este evento? As inscrições vinculadas também serão removidas."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </Box>
  );
}
