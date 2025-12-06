import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Crie um tipo para identificar seus modais
export type ModalId = 'BracoModalForm' | 'CorModalForm' | 'CaptadorModalForm' | 'MarcaModalForm' | 'ModeloModalForm' | 'PonteModalForm' | 'TarrachaModalForm';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // BehaviorSubject armazena o ID do modal atualmente aberto ou null
  // Ele permite que qualquer componente observe (subscribe) o estado.
  private readonly modalStateSubject = new BehaviorSubject<ModalId | null>(null);
  
  // Exposição como Observable para que componentes externos não possam mudar o estado diretamente
  public modalState$: Observable<ModalId | null> = this.modalStateSubject.asObservable();

  /**
   * Abre um modal específico.
   * @param id O ID do modal a ser aberto.
   */
  open(id: ModalId): void {
    this.modalStateSubject.next(id);
  }

  /**
   * Fecha o modal atualmente aberto.
   */
  close(): void {
    this.modalStateSubject.next(null);
  }

  /**
   * Verifica se um modal específico está aberto.
   * @param id O ID do modal a ser verificado.
   */
  isModalOpen(id: ModalId): boolean {
    return this.modalStateSubject.getValue() === id;
  }
}