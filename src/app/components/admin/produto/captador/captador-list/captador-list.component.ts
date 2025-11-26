import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Captador } from '../../../../../model/produto/captador';
import { CaptadorService } from '../../../../../service/produto/captador.service';
import { NotificationService } from '../../../../../service/notification/notification.service';

@Component({
  selector: 'app-captador-list',
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './captador-list.component.html',
  styleUrl: './captador-list.component.scss'
})
export class CaptadorListComponent {
  captadores: Captador[] = [];
  loading = false;

  // variaveis de controle para a paginacao
  totalRecords = 0;
  pageSize = 10;
  page = 0;

  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private captadorService:     CaptadorService,
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
    this.captadorService.getAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.captadores = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading captadores: ', error)
        this.loading = false;
      }
    });

    console.log(this.captadores);
  }

  loadCount(): void {
    this.captadorService.count().subscribe(data => {
      this.totalRecords = data;
    })
  }
  
  navigateToCreate(): void {
    this.router.navigate(['/admin/captadores/create']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/admin/captadores/edit', id]);
  }

  deleteBraco(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta cor?')) {
      this.captadorService.delete(id).subscribe({
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
    this.captadorService.getByFormato(termo).subscribe({
      next: (data) => {
        this.captadores = data; 
        this.totalRecords = data.length;
        this.page = 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching captadores: ', error);
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
