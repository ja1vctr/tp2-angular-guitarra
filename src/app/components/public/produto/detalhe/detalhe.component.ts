import { CommonModule, CurrencyPipe, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Guitarra } from '../../../../model/produto/guitarra';
import { GuitarraService } from '../../../../service/produto/guitarra.service';
import { CartService } from '../../../../service/cart/cart.service';

@Component({
  selector: 'app-detalhe-guitarra',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
  ],
  templateUrl: './detalhe.component.html',
  styleUrl: './detalhe.component.scss',
})
export class DetalheComponent implements OnInit, OnDestroy {
  guitarra?: Guitarra;
  imagemUrl: string | null = null;
  loading = false;
  error: string | null = null;
  readonly placeholder = 'assets/fender.png';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private guitarraService: GuitarraService,
    private cart: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/home']);
      return;
    }
    this.fetchGuitarra(id);
  }

  ngOnDestroy(): void {
    if (this.imagemUrl) {
      URL.revokeObjectURL(this.imagemUrl);
    }
  }

  private fetchGuitarra(id: number): void {
    this.loading = true;
    this.error = null;
    this.guitarraService.getById(id).subscribe({
      next: (guitarra) => {
        this.guitarra = guitarra;
        this.loading = false;
        this.loadImagem(id);
      },
      error: () => {
        this.error = 'Nao foi possivel carregar a guitarra.';
        this.loading = false;
      },
    });
  }

  private loadImagem(id: number): void {
    this.guitarraService.getImagem(id).subscribe({
      next: (blob) => {
        if (this.imagemUrl) {
          URL.revokeObjectURL(this.imagemUrl);
        }
        this.imagemUrl = URL.createObjectURL(blob);
      },
      error: () => {
        this.imagemUrl = null;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  addToCart(): void {
    if (!this.guitarra) return;
    this.cart.addItem(this.guitarra, 1);
  }
}
