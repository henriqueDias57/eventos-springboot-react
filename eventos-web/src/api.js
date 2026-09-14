import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para converter mensagens de erro em linguagem amigável
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let mensagem = 'Ocorreu um erro inesperado. Tente novamente.';

    if (error.response) {
      const { status, data } = error.response;
      if (status === 400) {
        mensagem = data?.message || data?.mensagem || 'Verifique os campos preenchidos e tente novamente.';
      } else if (status === 404) {
        mensagem = 'O registro que você procura não foi encontrado.';
      } else if (status === 409) {
        mensagem = data?.message || 'Este registro já existe ou causa conflito.';
      } else if (status === 500) {
        mensagem = 'Erro interno do servidor. Tente novamente em alguns instantes.';
      }
    } else if (error.code === 'ERR_NETWORK') {
      mensagem = 'Sem conexão com o servidor. Verifique se o sistema está ligado.';
    }

    return Promise.reject({ mensagem, original: error });
  }
);

// === CATEGORIAS ===
export const categoriaApi = {
  listar: () => api.get('/categorias'),
  buscarPorId: (id) => api.get(`/categorias/${id}`),
  criar: (dados) => api.post('/categorias', dados),
  atualizar: (id, dados) => api.put(`/categorias/${id}`, dados),
  deletar: (id) => api.delete(`/categorias/${id}`),
};

// === EVENTOS ===
export const eventoApi = {
  listar: () => api.get('/eventos'),
  buscarPorId: (id) => api.get(`/eventos/${id}`),
  listarPorCategoria: (categoriaId) => api.get(`/eventos/categoria/${categoriaId}`),
  criar: (dados) => api.post('/eventos', dados),
  atualizar: (id, dados) => api.put(`/eventos/${id}`, dados),
  deletar: (id) => api.delete(`/eventos/${id}`),
};

// === INSCRIÇÕES ===
export const inscricaoApi = {
  listar: () => api.get('/inscricoes'),
  buscarPorId: (id) => api.get(`/inscricoes/${id}`),
  listarPorEvento: (eventoId) => api.get(`/inscricoes/evento/${eventoId}`),
  criar: (dados) => api.post('/inscricoes', dados),
  atualizar: (id, dados) => api.put(`/inscricoes/${id}`, dados),
  deletar: (id) => api.delete(`/inscricoes/${id}`),
};

// === RELATÓRIOS ===
export const relatorioApi = {
  agregacaoCategoria: () => api.get('/relatorios/agregacao-categoria'),
  estatisticasEventos: () => api.get('/relatorios/estatisticas-eventos'),
};

export default api;
