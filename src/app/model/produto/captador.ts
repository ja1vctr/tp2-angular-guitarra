export interface Captador {
  id: number;
  marca: string;
  modelo: string;
  posicao: PosicaoCaptador;
 }

 export interface PosicaoCaptador {
  id: number;
  label: string;
 }

 export const POSICOES_CAPTADOR: PosicaoCaptador[] = [
  { id: 1, label: 'BRACO' },
  { id: 2, label: 'MEIO' },
  { id: 3, label: 'PONTE' }
];