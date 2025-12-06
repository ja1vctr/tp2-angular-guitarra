export interface Funcionario {
  id?: number;
  nome: string;
  dataNascimento: Date;
  cpf: string;
  dataAdmissao: Date;
  cargo: string;
  salario: number;
  email: string;
  senha?: string;
}
