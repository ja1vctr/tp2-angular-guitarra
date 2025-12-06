import { Component, signal } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Modelo } from '../../../../model/produto/modelo';
import { Guitarra } from '../../../../model/produto/guitarra';
import { GuitarraService } from '../../../../service/produto/guitarra.service';
import { MatCardActions, MatCardContent, MatCardSubtitle, MatCardTitle, MatCardHeader, MatCard } from "@angular/material/card";
import { NgFor, NgIf, DecimalPipe, CurrencyPipe } from '@angular/common';
import { GuitarraSearchService } from '../../../../service/produto/guitarra-search.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from '../../../../service/cart/cart.service';

type CardGuitarra = {
  idGuitarra?: number;
  nome?: string|null;
  modelo?: Modelo|null;
  preco?: number|null;
  imagemUrl?: string;
}

@Component({
  selector: 'app-card',
  imports: [
    MatCardActions, 
    MatCardContent, 
    MatCardSubtitle, 
    MatCardTitle, 
    MatCardHeader, 
    MatCard,
    // DecimalPipe,
    CurrencyPipe,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})

export class CardComponent {
  guitarras:Guitarra [] = []
  cards = signal<CardGuitarra[]>([]);

  loading = false;
  private searchSub?: Subscription;
  private imageCache = new Map<number, string>();
  private placeholder = 'assets/fender.png';

  // variaveis de controle para a paginacao
  totalRecords = 0;
  pageSize = 10;
  page = 0;

  constructor(
    private guitarraService: GuitarraService,
    private guitarraSearch: GuitarraSearchService,
    private router: Router,
    private cart: CartService,
  ) {}

  ngOnInit(): void {
    this.loadGuitarras()
    this.searchSub = this.guitarraSearch.query$.subscribe((term) => {
      this.onSearch(term);
    });
    this.guitarraSearch.page$.subscribe(({page, pageSize}) => {
      this.page = page;
      this.pageSize = pageSize;
      this.loadGuitarras();
    });
  }

  openDetails(card: CardGuitarra): void {
    if (!card.idGuitarra) return;
    this.router.navigate(['/produto', card.idGuitarra]);
  }

  adicionarAoCarrinho(card: CardGuitarra): void {
    const guitarra = this.guitarras.find((g) => g.id === card.idGuitarra);
    if (!guitarra) return;
    this.cart.addItem(guitarra, 1);
  }

  loadGuitarras() {
    this.loading = true;
    this.guitarraService.getAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.guitarras = data;
        this.carregarCards();
        this.preloadImagens();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading guitarras: ', error)
        this.loading = false;
      }
    });
  }

  private onSearch(term: string) {
    const trimmed = (term || '').trim();
    if (!trimmed) {
      this.page = 0;
      this.loadGuitarras();
      return;
    }
    this.loading = true;
    this.guitarraService.getByNome(trimmed).subscribe({
      next: (data) => {
        this.guitarras = data;
        this.carregarCards();
        this.preloadImagens();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching guitarras: ', error)
        this.loading = false;
      }
    });
  }

  carregarCards(): void {
    const list: CardGuitarra[] = this.guitarras.map(p => ({
      idGuitarra: p.id!,
      nome: p.nome,
      modelo: p.modelo,
      preco: p.preco,
      imagemUrl: this.imageCache.get(p.id!) || this.placeholder
   }));
    this.cards.set(list);
  }

  loadCount(): void {
    this.guitarraService.count().subscribe(data => {
      this.totalRecords = data;
    })
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadGuitarras();
  }

  private preloadImagens(): void {
    this.guitarras.forEach((g) => {
      const id = g.id;
      if (!id) return;
      if (this.imageCache.has(id)) return;
      this.guitarraService.getImagem(id).subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          const anterior = this.imageCache.get(id);
          if (anterior && anterior !== this.placeholder) {
            URL.revokeObjectURL(anterior);
          }
          this.imageCache.set(id, url);
          this.cards.update((cards) =>
            cards.map((c) =>
              c.idGuitarra === id ? { ...c, imagemUrl: url } : c
            )
          );
        },
        error: () => {
          // mantém placeholder
        },
      });
    });
  }
}
