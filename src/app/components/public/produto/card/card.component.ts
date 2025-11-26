import { Component, signal } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Modelo } from '../../../../model/produto/modelo';
import { Guitarra } from '../../../../model/produto/guitarra';
import { GuitarraService } from '../../../../service/produto/guitiarra.service';
import { MatCardActions, MatCardContent, MatCardSubtitle, MatCardTitle, MatCardHeader, MatCard } from "@angular/material/card";
import { NgFor, NgIf, DecimalPipe, CurrencyPipe } from '@angular/common';

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

  // variaveis de controle para a paginacao
  totalRecords = 0;
  pageSize = 10;
  page = 0;

  constructor(
    private guitarraService: GuitarraService,
  ) {}

  ngOnInit(): void {
    this.loadGuitarras()
  }

  loadGuitarras() {
    this.loading = true;
    this.guitarraService.getAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.guitarras = data;
        this.carregarCards();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading guitarras: ', error)
        this.loading = false;
      }
    });
  }

  carregarCards(): void {
    const list: CardGuitarra[] = this.guitarras.map(p => ({
      idPlano: p.id!,
      nome: p.nome,
      modelo: p.modelo,
      preco: p.preco,
      imagemUrl: 'assets/fender.png'
   }));
    this.cards.set(list);
  }

  loadCount(): void {
    this.guitarraService.count().subscribe(data => {
      this.totalRecords = data;
    })
  }

  paginar(event: PageEvent): void {
    if (/*this.searchTerm.trim() === ''*/ true) {
        this.page = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadGuitarras();
    } else {
        // Se estiver em modo de busca, podemos apenas mostrar um aviso
        console.warn('A paginação está desativada durante a busca.');
    }
  }
}
