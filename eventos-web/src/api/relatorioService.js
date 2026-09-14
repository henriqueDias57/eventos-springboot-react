import { apiClient } from './client';

export const relatorioService = {
  /**
   * Consome a Native Query de agregação por Categoria (COUNT, SUM, GROUP BY, JOIN)
   */
  obterAgregacaoCategoria: async () => {
    const response = await apiClient.get('/relatorios/agregacao-categoria');
    return response.data;
  },

  /**
   * Consome a Native Query de estatísticas de Eventos (COUNT, AVG, GROUP BY)
   */
  obterEstatisticasEventos: async () => {
    const response = await apiClient.get('/relatorios/estatisticas-eventos');
    return response.data;
  },
};
