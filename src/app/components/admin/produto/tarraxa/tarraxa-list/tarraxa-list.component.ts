import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Tarraxa } from '../../../../../model/produto/tarraxa';
import { TarraxaService } from '../../../../../service/produto/tarraxa.service';
import { NotificationService } from '../../../../../service/notification/notification.service';


@Component({
  selector: 'app-tarraxa-list',
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './tarraxa-list.component.html',
  styleUrl: './tarraxa-list.component.scss'
})
export class TarraxaListComponent implements OnInit{
  tarraxas: Tarraxa[] = [];
  loading = false;

  // variaveis de controle para a paginacao
  totalRecords = 0;
  pageSize = 10;
  page = 0;

  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private tarraxaService:        TarraxaService,
    private router:              Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.setupSearchStream();
    if (this.searchTerm === '') {
      this.loadTarraxas();
    }
    this.loadCount();
  }

  loadTarraxas() {
    this.loading = true;
    this.tarraxaService.getAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.tarraxas = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tarraxas: ', error)
        this.loading = false;
      }
    });

    console.log(this.tarraxas);
  }

  loadCount(): void {
    this.tarraxaService.count().subscribe(data => {
      this.totalRecords = data;
    })
  }
  
  navigateToCreate(): void {
    this.router.navigate(['/admin/tarraxas/create']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/admin/tarraxas/edit', id]);
  }

  deleteTarraxa(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta cor?')) {
      this.tarraxaService.delete(id).subscribe({
        next: () => {
          this.loadTarraxas();
          this.notificationService.showSuccess('Tarraxa excluída com sucesso!');
        },
        error: (error) => {
          console
          .error('Não foi possível ' + id + ': ', error);
        }
      });
    }
  }

  setupSearchStream(): void {
    this.searchSubject.pipe(
      debounceTime(300), // ESPERA 300ms depois que o usuário para de digitar
      distinctUntilChanged() // Ignora se o termo digitado for o mesmo do anterior
    ).subscribe((searchTerm: string) => {
      // Quando o stream for acionado, chama a função de busca
      this.executeSearch(searchTerm);
    });
  }
  onSearchChange(novoTermo: string): void {
    // Usa o valor do ngModel para enviar ao Subject
    this.searchSubject.next(novoTermo);
  }

  executeSearch(termo: string): void {
    if (termo.trim() === '') {
      this.loadTarraxas();
      this.loadCount();
      return;
    }
    this.loading = true;
    this.tarraxaService.getByModelo(termo).subscribe({
      next: (data) => {
        this.tarraxas = data; 
        this.totalRecords = data.length;
        this.page = 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching modelos: ', error);
        this.loading = false;
      }
    });

    this.loading = true;
  }

  paginar(event: PageEvent): void {
    if (this.searchTerm.trim() === '') {
        this.page = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadTarraxas();
    } else {
        // Se estiver em modo de busca, podemos apenas mostrar um aviso
        console.warn('A paginação está desativada durante a busca.');
    }
  }
}
