import { apiClient } from './client';

export const categoriaService = {
  listarTodas: async () => {
    const response = await apiClient.get('/categorias');
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await apiClient.get(`/categorias/${id}`);
    return response.data;
  },

  salvar: async (categoria) => {
    const response = await apiClient.post('/categorias', categoria);
    return response.data;
  },

  atualizar: async (id, categoria) => {
    const response = await apiClient.put(`/categorias/${id}`, categoria);
    return response.data;
  },

  deletar: async (id) => {
    await apiClient.delete(`/categorias/${id}`);
  },
};
