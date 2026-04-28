import type {
  HealthResponse,
  ItemCompra,
  ItemCompraRequest,
  ListaCompra,
  ListaCompraRequest,
  ListaCompraResumo,
  Mercado,
  MercadoRequest,
  Page
} from '../types/api';

const API_URL =
  (import.meta as unknown as { env: { VITE_API_URL?: string } }).env.VITE_API_URL ||
  'http://localhost:8081';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    let message = `Erro ${response.status}`;
    try {
      const data = await response.json();
      message = data.message || data.error || JSON.stringify(data);
    } catch {
      message = await response.text();
    }
    throw new Error(message || `Erro ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

const pageQuery = (sort = 'nome,asc') => `page=0&size=100&sort=${sort}`;

export const api = {
  health: () => request<HealthResponse>('/health'),

  listarMercados: () => request<Page<Mercado>>(`/mercados?${pageQuery()}`),
  criarMercado: (data: MercadoRequest) =>
    request<Mercado>('/mercados', { method: 'POST', body: JSON.stringify(data) }),
  atualizarMercado: (id: number, data: MercadoRequest) =>
    request<Mercado>(`/mercados/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletarMercado: (id: number) => request<void>(`/mercados/${id}`, { method: 'DELETE' }),

  listarListas: () => request<Page<ListaCompra>>(`/listas?${pageQuery()}`),
  listarResumoListas: () => request<Page<ListaCompraResumo>>(`/listas/resumo?${pageQuery()}`),
  buscarListasPorNome: (nome: string) =>
    request<Page<ListaCompra>>(`/listas/busca/nome?nome=${encodeURIComponent(nome)}&${pageQuery()}`),
  buscarListasPorMercado: (mercadoId: number) =>
    request<Page<ListaCompra>>(`/listas/busca/mercado/${mercadoId}?${pageQuery()}`),
  criarLista: (data: ListaCompraRequest) =>
    request<ListaCompra>('/listas', { method: 'POST', body: JSON.stringify(data) }),
  atualizarLista: (id: number, data: ListaCompraRequest) =>
    request<ListaCompra>(`/listas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletarLista: (id: number) => request<void>(`/listas/${id}`, { method: 'DELETE' }),

  listarItens: () => request<Page<ItemCompra>>(`/itens?${pageQuery()}`),
  buscarItensPorNome: (nome: string) =>
    request<Page<ItemCompra>>(`/itens/busca/nome?nome=${encodeURIComponent(nome)}&${pageQuery()}`),
  buscarItensPorPreco: (precoMin: number, precoMax: number) =>
    request<Page<ItemCompra>>(`/itens/busca/preco?precoMin=${precoMin}&precoMax=${precoMax}&${pageQuery('preco,asc')}`),
  buscarItensPorQuantidade: (quantidade: number) =>
    request<Page<ItemCompra>>(`/itens/busca/quantidade-minima?quantidade=${quantidade}&${pageQuery('quantidade,desc')}`),
  criarItem: (data: ItemCompraRequest) =>
    request<ItemCompra>('/itens', { method: 'POST', body: JSON.stringify(data) }),
  atualizarItem: (id: number, data: ItemCompraRequest) =>
    request<ItemCompra>(`/itens/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletarItem: (id: number) => request<void>(`/itens/${id}`, { method: 'DELETE' })
};
