import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Ponte } from '../../../../../model/produto/ponte';
import { PonteService } from '../../../../../service/produto/ponte.service';
import { NotificationService } from '../../../../../service/notification/notification.service';


@Component({
  selector: 'app-ponte-list',
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './ponte-list.component.html',
  styleUrl: './ponte-list.component.scss'
})
export class PonteListComponent {
  pontes: Ponte[] = [];
  loading = false;

  // variaveis de controle para a paginacao
  totalRecords = 0;
  pageSize = 10;
  page = 0;

  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private ponteService:        PonteService,
    private router:              Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.setupSearchStream();
    if (this.searchTerm === '') {
      this.loadPontes();
    }
    this.loadCount();
  }

  loadPontes() {
    this.loading = true;
    this.ponteService.getAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.pontes = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pontes: ', error)
        this.loading = false;
      }
    });

    console.log(this.pontes);
  }

  loadCount(): void {
    this.ponteService.count().subscribe(data => {
      this.totalRecords = data;
    })
  }
  
  navigateToCreate(): void {
    this.router.navigate(['/admin/pontes/create']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/admin/pontes/edit', id]);
  }

  deletePonte(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta cor?')) {
      this.ponteService.delete(id).subscribe({
        next: () => {
          this.loadPontes();
          this.notificationService.showSuccess('Ponte excluída com sucesso!');
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
      this.loadPontes();
      this.loadCount();
      return;
    }
    this.ponteService.getByModelo(termo).subscribe({
      next: (data) => {
        this.pontes = data; 
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
        this.loadPontes();
    } else {
        // Se estiver em modo de busca, podemos apenas mostrar um aviso
        console.warn('A paginação está desativada durante a busca.');
    }
  }
}
