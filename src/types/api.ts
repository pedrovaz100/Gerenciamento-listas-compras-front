export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
};

export type Mercado = {
  id: number;
  nome: string;
  endereco: string;
};

export type MercadoRequest = {
  nome: string;
  endereco: string;
};

export type ListaCompra = {
  id: number;
  nome: string;
  dataCriacao: string;
  mercado: Mercado;
  itens: ItemCompra[];
};

export type ListaCompraResumo = {
  id: number;
  nome: string;
};

export type ListaCompraRequest = {
  nome: string;
  dataCriacao: string;
  mercadoId: number;
};

export type ItemCompra = {
  id: number;
  nome: string;
  quantidade: number;
  preco: number;
  listaCompraId: number;
};

export type ItemCompraRequest = {
  nome: string;
  quantidade: number;
  preco: number;
  listaCompraId: number;
};

export type HealthResponse = {
  status: string;
  message: string;
};
