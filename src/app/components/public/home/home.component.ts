import { Component } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CardComponent } from "../produto/card/card.component";
import { GuitarraService } from '../../../service/produto/guitarra.service';
import { GuitarraSearchService } from '../../../service/produto/guitarra-search.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CardComponent, MatPaginatorModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  totalRecords = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(
    private guitarraService: GuitarraService,
    private guitarraSearch: GuitarraSearchService
  ) {}

  ngOnInit(): void {
    this.loadCount();
  }

  loadCount(): void {
    this.guitarraService.count().subscribe((total: number) => {
      this.totalRecords = total;
    });
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    // sinaliza aos cards que a página mudou (usando o próprio serviço de busca para compartilhar estado)
    this.guitarraSearch.setPage(this.pageIndex, this.pageSize);
  }
}
