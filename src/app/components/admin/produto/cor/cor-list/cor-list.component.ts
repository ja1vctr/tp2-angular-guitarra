import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Cor } from '../../../../../model/produto/cor';
import { CorService } from '../../../../../service/produto/cor.service';
import { NotificationService } from '../../../../../service/notification/notification.service';

@Component({
  selector: 'app-cor-list',
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './cor-list.component.html',
  styleUrl: './cor-list.component.scss'
})
export class CorListComponent implements OnInit {
  cores: Cor[] = [];
  loading = false;

  // variaveis de controle para a paginacao
  totalRecords = 0;
  pageSize = 10;
  page = 0;

  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private corService:          CorService,
    private router:              Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.setupSearchStream();
    if (this.searchTerm === '') {
      this.loadCores();
    }
    this.loadCount();
  }

  loadCores() {
    this.loading = true;
    this.corService.getAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.cores = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cores: ', error)
        this.loading = false;
      }
    });
  }

  loadCount(): void {
    this.corService.count().subscribe(data => {
      this.totalRecords = data;
    })
  }
  
  navigateToCreate(): void {
    this.router.navigate(['/admin/cores/create']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/admin/cores/edit', id]);
  }

  deleteCor(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta cor?')) {
      this.corService.delete(id).subscribe({
        next: () => {
          this.loadCores();
          this.notificationService.showSuccess('Cor excluída com sucesso!');
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
      this.loadCores();
      this.loadCount();
      return;
    }

    this.loading = true;
    this.corService.getByNome(termo).subscribe({
      next: (data) => {
        this.cores = data; 
        this.totalRecords = data.length;
        this.page = 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching cores: ', error);
        this.loading = false;
      }
    });
  }

  paginar(event: PageEvent): void {
    if (this.searchTerm.trim() === '') {
        this.page = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadCores();
    } else {
        // Se estiver em modo de busca, podemos apenas mostrar um aviso
        console.warn('A paginação está desativada durante a busca.');
    }
  }
}
