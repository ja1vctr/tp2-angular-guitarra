export interface GuitarraPayload {
  id?: number;
  nome: string;
  descricao?: string;
  preco: number;
  quantidade: number;
  status: boolean;

  anoFabricacao?: number;
  madeira?: string;
  numeroDeCordas: number;

  idBraco: number;
  idCor: number;
  idCaptadorBraco?: number | null;
  idCaptadorMeio?: number | null;
  idCaptadorPonte?: number | null;
  idMarca: number;
  idModelo: number;
  idPonte: number;
  idTarracha: number;
}
