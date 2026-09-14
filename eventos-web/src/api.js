import axios from 'axios';

// URL base da API (em produção pode apontar para a URL do backend hospedado)
const apiBase = import.meta.env.VITE_API_URL 
  ? (import.meta.env.VITE_API_URL.endsWith('/api') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api`)
  : '/api';

const api = axios.create({
  baseURL: apiBase,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Chave mestra salva na sessão
const ACCESS_KEY_STORAGE = 'eventos_access_master_key';

export const getStoredAccessKey = () => {
  return sessionStorage.getItem(ACCESS_KEY_STORAGE) || localStorage.getItem(ACCESS_KEY_STORAGE) || '';
};

export const setStoredAccessKey = (key, persist = true) => {
  sessionStorage.setItem(ACCESS_KEY_STORAGE, key);
  if (persist) {
    localStorage.setItem(ACCESS_KEY_STORAGE, key);
  }
};

export const clearStoredAccessKey = () => {
  sessionStorage.removeItem(ACCESS_KEY_STORAGE);
  localStorage.removeItem(ACCESS_KEY_STORAGE);
};

// Interceptor de Requisição: Injeta a chave de segurança de infraestrutura
api.interceptors.request.use((config) => {
  const key = getStoredAccessKey();
  if (key) {
    config.headers['X-Access-Key'] = key;
    config.headers['Authorization'] = `Basic ${btoa(`admin:${key}`)}`;
  }
  return config;
});

// Interceptor de Resposta: Trata erros e 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let mensagem = 'Ocorreu um erro inesperado. Tente novamente.';

    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        mensagem = 'Acesso não autorizado ou senha incorreta.';
        // Notifica a aplicação para abrir a tela de bloqueio
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      } else if (status === 400) {
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

    return Promise.reject({ mensagem, status: error.response?.status, original: error });
  }
);

// === AUTENTICAÇÃO / VALIDAÇÃO DE ACESSO ===
export const authApi = {
  validarAcesso: async (chave) => {
    return axios.get(`${apiBase}/categorias`, {
      headers: {
        'X-Access-Key': chave,
        'Authorization': `Basic ${btoa(`admin:${chave}`)}`
      }
    });
  }
};

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
