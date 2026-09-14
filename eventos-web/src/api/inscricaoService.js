import { apiClient } from './client';

export const inscricaoService = {
  listarTodas: async () => {
    const response = await apiClient.get('/inscricoes');
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await apiClient.get(`/inscricoes/${id}`);
    return response.data;
  },

  listarPorEvento: async (eventoId) => {
    const response = await apiClient.get(`/inscricoes/evento/${eventoId}`);
    return response.data;
  },

  salvar: async (inscricao) => {
    const response = await apiClient.post('/inscricoes', inscricao);
    return response.data;
  },

  atualizar: async (id, inscricao) => {
    const response = await apiClient.put(`/inscricoes/${id}`, inscricao);
    return response.data;
  },

  deletar: async (id) => {
    await apiClient.delete(`/inscricoes/${id}`);
  },
};
