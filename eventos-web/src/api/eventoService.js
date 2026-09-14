import { apiClient } from './client';

export const eventoService = {
  listarTodos: async () => {
    const response = await apiClient.get('/eventos');
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await apiClient.get(`/eventos/${id}`);
    return response.data;
  },

  listarPorCategoria: async (categoriaId) => {
    const response = await apiClient.get(`/eventos/categoria/${categoriaId}`);
    return response.data;
  },

  salvar: async (evento) => {
    const response = await apiClient.post('/eventos', evento);
    return response.data;
  },

  atualizar: async (id, evento) => {
    const response = await apiClient.put(`/eventos/${id}`, evento);
    return response.data;
  },

  deletar: async (id) => {
    await apiClient.delete(`/eventos/${id}`);
  },
};
