import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Dashboard from '../pages/Dashboard';

// Mock das chamadas de serviço de API
vi.mock('../api/relatorioService', () => ({
  relatorioService: {
    obterAgregacaoCategoria: vi.fn().mockResolvedValue([
      {
        categoriaId: 1,
        nomeCategoria: 'Tecnologia',
        totalEventos: 2,
        totalInscricoes: 4,
        faturamentoEstimado: 400.0,
      },
    ]),
    obterEstatisticasEventos: vi.fn().mockResolvedValue([
      {
        eventoId: 1,
        tituloEvento: 'Summit AI',
        totalInscritos: 2,
        inscricaoConfirmada: 2,
        precoMedio: 150.0,
      },
    ]),
  },
}));

describe('Dashboard Component', () => {
  it('Deve renderizar o título do dashboard e métricas agregadas', async () => {
    render(<Dashboard />);
    expect(await screen.findByText('Dashboard & Métricas Agregadas')).toBeDefined();
    expect(await screen.findByText('Tecnologia')).toBeDefined();
  });
});
