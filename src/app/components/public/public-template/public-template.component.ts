import { MatSidenavModule } from '@angular/material/sidenav';
import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';

import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
// import { SidebarComponent } from '../sidebar/sidebar.component';
import { CartSidenavComponent } from '../carrinho/cart-sidenav.component';
import { CartService } from '../../../service/cart/cart.service';

@Component({
  standalone: true,
  selector: 'app-public-template',
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    FooterComponent,
    MatSidenavModule,
    CartSidenavComponent,
  ],
  templateUrl: './public-template.component.html',
  styleUrl: './public-template.component.scss'
})
export class PublicTemplateComponent implements OnDestroy {
  opened = false;
  showChrome = true;
  private sub: Subscription;
  cartSub?: Subscription;

  constructor(private router: Router, private cart: CartService) {
    this.showChrome = this.shouldShowChrome(this.router.url);
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((evt) => {
        this.showChrome = this.shouldShowChrome(evt.urlAfterRedirects);
      });
    this.cartSub = this.cart.opened$.subscribe((open: boolean) => (this.opened = open));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.cartSub?.unsubscribe();
  }

  private shouldShowChrome(url: string): boolean {
    return !url.includes('/login') && !url.includes('/register');
  }
}
