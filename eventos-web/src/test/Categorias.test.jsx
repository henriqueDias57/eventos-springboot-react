import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Categorias from '../pages/Categorias';

vi.mock('../api/categoriaService', () => ({
  categoriaService: {
    listarTodas: vi.fn().mockResolvedValue([
      { id: 1, nome: 'Tecnologia', descricao: 'Eventos Tech' },
      { id: 2, nome: 'Negócios', descricao: 'Biz' },
    ]),
  },
}));

vi.mock('../api/eventoService', () => ({
  eventoService: {
    listarPorCategoria: vi.fn().mockResolvedValue([]),
  },
}));

describe('Categorias Component', () => {
  it('Deve listar categorias retornadas da API', async () => {
    const showToast = vi.fn();
    render(<Categorias showToast={showToast} />);
    
    expect(await screen.findByText('Gerenciamento de Categorias')).toBeDefined();
    expect(await screen.findByText('Tecnologia')).toBeDefined();
    expect(await screen.findByText('Negócios')).toBeDefined();
  });
});
