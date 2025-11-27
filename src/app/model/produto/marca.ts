export interface Marca {
  id?: number;
  nome?: string;
  cnpj?: string;
  listaModeos: Modelo[];
}

export interface Modelo {
  id?: number;
  nome?: string;
}