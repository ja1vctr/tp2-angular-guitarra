export interface Cliente {
  id?: number;
  permitirMarketing: boolean;
  nome: string;
  email: string;
  senha?: string;
  cpf: string;
  dataNascimento?: Date;
}
