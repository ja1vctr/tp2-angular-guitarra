import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Marca } from '../../../../../model/produto/marca';
import { MarcaService } from '../../../../../service/produto/marca.service';
import { NotificationService } from '../../../../../service/notification/notification.service';

@Component({
  selector: 'app-marca-list',
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './marca-list.component.html',
  styleUrl: './marca-list.component.scss'
})
export class MarcaListComponent implements OnInit {
  marcas: Marca[] = [];
  loading = false;

  // variaveis de controle para a paginacao
  totalRemarcads = 0;
  pageSize = 10;
  page = 0;

  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private marcaService:          MarcaService,
    private router:              Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.setupSearchStream();
    if (this.searchTerm === '') {
      this.loadMarcas();
    }
    this.loadCount();
  }

  loadMarcas() {
    this.loading = true;
    this.marcaService.getAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.marcas = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading marcas: ', error)
        this.loading = false;
      }
    });
  }

  loadCount(): void {
    this.marcaService.count().subscribe(data => {
      this.totalRemarcads = data;
    })
  }
  
  navigateToCreate(): void {
    this.router.navigate(['/admin/marcas/create']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/admin/marcas/edit', id]);
  }

  deleteMarca(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta marca?')) {
      this.marcaService.delete(id).subscribe({
        next: () => {
          this.loadMarcas();
          this.notificationService.showSuccess('Marca excluída com sucesso!');
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
      this.loadMarcas();
      this.loadCount();
      return;
    }

    this.loading = true;
    this.marcaService.getByNome(termo).subscribe({
      next: (data) => {
        this.marcas = data; 
        this.totalRemarcads = data.length;
        this.page = 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching marcas: ', error);
        this.loading = false;
      }
    });
  }

  paginar(event: PageEvent): void {
    if (this.searchTerm.trim() === '') {
        this.page = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadMarcas();
    } else {
        // Se estiver em modo de busca, podemos apenas mostrar um aviso
        console.warn('A paginação está desativada durante a busca.');
    }
  }
}
