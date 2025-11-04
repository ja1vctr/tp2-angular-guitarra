import { Braco } from "./braco";
import { Cor } from "./cor";
import { Modelo } from "./modelo";

export interface Guitarra {
  id?: number;
  nome?: string;
  descricao?: string;
  preco?: number;
  quantidade?: number;
  status?: boolean;
  
  dataDeFabricacao?: Date;
  madeira?: string;
  peso?: number;
  assiantura?: string;
  blindageEletronica?: boolean;
  numeroDeCordas?: number;

  braco?: Braco;
  // captadorBraco?: Captador;
  // captadorMeio?: Captador;
  // captadorPonte?: Captador;
  cor?: Cor;
  // ponte?: Ponte;
  // marca?: Marca;
  modelo?: Modelo;
  // tarracha?: Tarracha;
}