import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Braco } from '../../../../../model/produto/braco';
import { BracoService } from '../../../../../service/produto/braco.service';
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
  templateUrl: './braco-list.component.html',
  styleUrl: './braco-list.component.scss'
})
export class BracoListComponent implements OnInit {
  bracos: Braco[] = [];
  loading = false;

  // variaveis de controle para a paginacao
  totalBracos = 0;
  pageSize = 10;
  page = 0;

  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private bracoService:        BracoService,
    private router:              Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.setupSearchStream();
    if (this.searchTerm === '') {
      this.loadBracos();
    }
    this.loadCount();
  }

  loadBracos() {
    this.loading = true;
    this.bracoService.getAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.bracos = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bracos: ', error)
        this.loading = false;
      }
    });
  }

  loadCount(): void {
    this.bracoService.count().subscribe(data => {
      this.totalBracos = data;
    })
  }
  
  navigateToCreate(): void {
    this.router.navigate(['/admin/bracos/create']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/admin/bracos/edit', id]);
  }

  deleteBraco(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta cor?')) {
      this.bracoService.delete(id).subscribe({
        next: () => {
          this.loadBracos();
          this.notificationService.showSuccess('Braco excluída com sucesso!');
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
      this.loadBracos();
      this.loadCount();
      return;
    }

    this.loading = true;
    this.bracoService.getByFormato(termo).subscribe({
      next: (data) => {
        this.bracos = data; 
        this.totalBracos = data.length;
        this.page = 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching bracos: ', error);
        this.loading = false;
      }
    });
  }

  paginar(event: PageEvent): void {
    if (this.searchTerm.trim() === '') {
        this.page = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadBracos();
    } else {
        // Se estiver em modo de busca, podemos apenas mostrar um aviso
        console.warn('A paginação está desativada durante a busca.');
    }
  }
}
