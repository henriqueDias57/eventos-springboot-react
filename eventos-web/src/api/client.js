import axios from 'axios';

/**
 * Cliente Axios configurado para a API Spring Boot do Backend.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para tratamento de erros padronizados
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'Ocorreu um erro ao se comunicar com o servidor.';
    
    if (error.response) {
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data && error.response.data.errors) {
        errorMessage = Object.values(error.response.data.errors).join(' | ');
      } else if (error.response.status === 404) {
        errorMessage = 'Recurso não encontrado no servidor.';
      } else if (error.response.status === 409) {
        errorMessage = 'Conflito de dados: este registro já existe ou possui dependências ativas.';
      }
    } else if (error.request) {
      errorMessage = 'Não foi possível conectar ao servidor Spring Boot. Verifique se o backend está rodando na porta 8080.';
    }

    return Promise.reject(new Error(errorMessage));
  }
);
