import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Card, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Tooltip, CircularProgress, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { inscricaoApi, eventoApi } from '../api';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';

const emptyForm = { nomeParticipante: '', emailParticipante: '', eventoId: '', status: 'CONFIRMADA' };

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const statusColors = {
  CONFIRMADA: 'success',
  PENDENTE: 'warning',
  CANCELADA: 'error',
};

export default function Inscricoes({ showToast }) {
  const [inscricoes, setInscricoes] = useState([]);
  const [eventos, setEventos] = useState([]);
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
      const [inscRes, evtRes] = await Promise.all([inscricaoApi.listar(), eventoApi.listar()]);
      setInscricoes(inscRes.data);
      setEventos(evtRes.data);
    } catch (err) {
      showToast(err.mensagem || 'Erro ao carregar inscrições.', 'error');
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

  const openEdit = (insc) => {
    setForm({
      nomeParticipante: insc.nomeParticipante,
      emailParticipante: insc.emailParticipante,
      eventoId: insc.eventoId?.toString() || '',
      status: insc.status || 'CONFIRMADA',
    });
    setEditingId(insc.id);
    setErrors({});
    setDialogOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.nomeParticipante.trim()) e.nomeParticipante = 'Preencha o nome do participante.';
    if (!form.emailParticipante.trim()) e.emailParticipante = 'Preencha o e-mail do participante.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailParticipante))
      e.emailParticipante = 'Informe um e-mail válido (ex: nome@email.com).';
    if (!form.eventoId) e.eventoId = 'Selecione um evento.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        eventoId: parseInt(form.eventoId),
      };
      if (editingId) {
        await inscricaoApi.atualizar(editingId, payload);
        showToast('Inscrição atualizada com sucesso!');
      } else {
        await inscricaoApi.criar(payload);
        showToast('Inscrição realizada com sucesso!');
      }
      setDialogOpen(false);
      loadData();
    } catch (err) {
      showToast(err.mensagem || 'Erro ao salvar inscrição.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await inscricaoApi.deletar(confirmDelete);
      showToast('Inscrição removida com sucesso!');
      setConfirmDelete(null);
      loadData();
    } catch (err) {
      showToast(err.mensagem || 'Não foi possível remover a inscrição.', 'error');
      setConfirmDelete(null);
    }
  };

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4">Inscrições</Typography>
          <Typography variant="body2" color="text.secondary">
            Registre participantes nos eventos — cada inscrição é vinculada a um evento
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>
          Nova Inscrição
        </Button>
      </Box>

      {/* Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : inscricoes.length === 0 ? (
        <Card>
          <EmptyState
            title="Nenhuma inscrição cadastrada"
            description="Inscreva o primeiro participante — lembre-se de cadastrar pelo menos um evento antes."
            actionLabel="Nova Inscrição"
            onAction={openNew}
          />
        </Card>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Participante</TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell>Evento</TableCell>
                  <TableCell>Data da Inscrição</TableCell>
                  <TableCell>Situação</TableCell>
                  <TableCell align="right" width={120}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inscricoes.map((insc) => (
                  <TableRow key={insc.id} hover>
                    <TableCell>
                      <Typography fontWeight={500}>{insc.nomeParticipante}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{insc.emailParticipante}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={insc.tituloEvento || `Evento #${insc.eventoId}`} size="small" color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">{formatDate(insc.dataInscricao)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={insc.status || 'CONFIRMADA'}
                        size="small"
                        color={statusColors[insc.status] || 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => openEdit(insc)} color="primary">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remover">
                        <IconButton size="small" onClick={() => setConfirmDelete(insc.id)} color="error">
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
        <DialogTitle>{editingId ? 'Editar Inscrição' : 'Nova Inscrição'}</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <TextField
            label="Nome do Participante"
            value={form.nomeParticipante}
            onChange={(e) => setField('nomeParticipante', e.target.value)}
            error={!!errors.nomeParticipante}
            helperText={errors.nomeParticipante}
            sx={{ mb: 2.5 }}
            autoFocus
          />
          <TextField
            label="E-mail do Participante"
            type="email"
            value={form.emailParticipante}
            onChange={(e) => setField('emailParticipante', e.target.value)}
            error={!!errors.emailParticipante}
            helperText={errors.emailParticipante}
            sx={{ mb: 2.5 }}
          />
          <TextField
            label="Evento"
            value={form.eventoId}
            onChange={(e) => setField('eventoId', e.target.value)}
            error={!!errors.eventoId}
            helperText={errors.eventoId || (eventos.length === 0 ? 'Cadastre um evento primeiro.' : '')}
            select
            sx={{ mb: 2.5 }}
          >
            {eventos.map((evt) => (
              <MenuItem key={evt.id} value={evt.id.toString()}>
                {evt.titulo}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Situação"
            value={form.status}
            onChange={(e) => setField('status', e.target.value)}
            select
          >
            <MenuItem value="CONFIRMADA">Confirmada</MenuItem>
            <MenuItem value="PENDENTE">Pendente</MenuItem>
            <MenuItem value="CANCELADA">Cancelada</MenuItem>
          </TextField>
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
        title="Remover Inscrição"
        message="Tem certeza que deseja remover esta inscrição?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </Box>
  );
}
