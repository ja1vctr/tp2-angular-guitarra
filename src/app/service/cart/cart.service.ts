import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem } from '../../model/cart/cart-item';
import { Guitarra } from '../../model/produto/guitarra';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  private openedSubject = new BehaviorSubject<boolean>(false);
  opened$ = this.openedSubject.asObservable();

  total$ = this.items$.pipe(
    map((items) =>
      items.reduce(
        (acc, item) => acc + (item.guitarra.preco || 0) * item.quantidade,
        0
      )
    )
  );

  openCart(): void {
    this.openedSubject.next(true);
  }

  closeCart(): void {
    this.openedSubject.next(false);
  }

  toggleCart(): void {
    this.openedSubject.next(!this.openedSubject.value);
  }

  addItem(guitarra: Guitarra, quantidade = 1): void {
    if (!guitarra?.id) return;
    const list = [...this.itemsSubject.value];
    const idx = list.findIndex((i) => i.guitarra.id === guitarra.id);
    if (idx >= 0) {
      list[idx] = {
        ...list[idx],
        quantidade: list[idx].quantidade + quantidade,
      };
    } else {
      list.push({ guitarra, quantidade });
    }
    this.itemsSubject.next(list);
    this.openCart();
  }

  updateQuantidade(id: number, quantidade: number): void {
    if (quantidade <= 0) {
      this.removeItem(id);
      return;
    }
    const list = this.itemsSubject.value.map((item) =>
      item.guitarra.id === id ? { ...item, quantidade } : item
    );
    this.itemsSubject.next(list);
  }

  increment(id: number): void {
    const list = this.itemsSubject.value.map((item) =>
      item.guitarra.id === id
        ? { ...item, quantidade: item.quantidade + 1 }
        : item
    );
    this.itemsSubject.next(list);
  }

  decrement(id: number): void {
    const list = this.itemsSubject.value
      .map((item) =>
        item.guitarra.id === id
          ? { ...item, quantidade: item.quantidade - 1 }
          : item
      )
      .filter((item) => item.quantidade > 0);
    this.itemsSubject.next(list);
  }

  removeItem(id: number): void {
    const filtered = this.itemsSubject.value.filter(
      (i) => i.guitarra.id !== id
    );
    this.itemsSubject.next(filtered);
  }

  clear(): void {
    this.itemsSubject.next([]);
  }
}
