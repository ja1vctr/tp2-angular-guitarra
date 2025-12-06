import { Braco } from "./braco";
import { Captador } from "./captador";
import { Cor } from "./cor";
import { Marca } from "./marca";
import { Modelo } from "./modelo";
import { Ponte } from "./ponte";
import { Tarraxa } from "./tarraxa";

export interface Guitarra {
  id?: number;
  nome?: string;
  descricao?: string;
  preco?: number;
  quantidade?: number;
  status?: boolean;
  
  anoFabricacao?: number;
  madeira?: string;
  numeroDeCordas?: number;

  braco?: Braco;
  captadorBraco?: Captador;
  captadorMeio?: Captador;
  captadorPonte?: Captador;
  cor?: Cor;
  ponte?: Ponte;
  marca?: Marca;
  modelo?: Modelo;
  tarracha?: Tarraxa;
}
