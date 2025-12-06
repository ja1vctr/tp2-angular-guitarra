import { Guitarra } from "../produto/guitarra";

export interface CartItem {
  guitarra: Guitarra;
  quantidade: number;
}
