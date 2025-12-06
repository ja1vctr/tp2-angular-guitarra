import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../../service/cart/cart.service';
import { CartItem } from '../../../model/cart/cart-item';
import { CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    CurrencyPipe,
  ],
  templateUrl: './cart-sidenav.component.html',
  styleUrl: './cart-sidenav.component.scss',
})
export class CartSidenavComponent {
  readonly placeholder = 'assets/fender.png';

  items$: Observable<CartItem[]>;
  total$: Observable<number>;

  constructor(private cart: CartService) {
    this.items$ = this.cart.items$;
    this.total$ = this.cart.total$;
  }

  close(): void {
    this.cart.closeCart();
  }

  increment(item: CartItem): void {
    if (!item.guitarra.id) return;
    this.cart.increment(item.guitarra.id);
  }

  decrement(item: CartItem): void {
    if (!item.guitarra.id) return;
    this.cart.decrement(item.guitarra.id);
  }

  remove(item: CartItem): void {
    if (!item.guitarra.id) return;
    this.cart.removeItem(item.guitarra.id);
  }
}
