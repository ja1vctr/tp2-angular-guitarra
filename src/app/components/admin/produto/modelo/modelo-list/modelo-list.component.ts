import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Modelo } from '../../../../../model/produto/modelo';
import { ModeloService } from '../../../../../service/produto/modelo.service';
import { NotificationService } from '../../../../../service/notification/notification.service';

@Component({
  selector: 'app-modelo-list',
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './modelo-list.component.html',
  styleUrl: './modelo-list.component.scss'
})
export class ModeloListComponent implements OnInit{
  modelos: Modelo[] = [];
  loading = false;

  // variaveis de controle para a paginacao
  totalModelos  = 0;
  pageSize = 20;
  page = 0;

  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private modeloService:       ModeloService,
    private router:              Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    console.log('ngOnInit rodou');
    this.setupSearchStream();
    if (this.searchTerm === '') {
      this.loadModelos();
    }
    this.loadCount();
  }

  loadModelos() {
    this.loading = true;
    this.modeloService.getAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.modelos = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading modelos: ', error)
        this.loading = false;
      }
    });
  }

  
  navigateToCreate(): void {
    this.router.navigate(['/admin/modelos/create']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/admin/modelos/edit', id]);
  }
  
  deleteModelo(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta modelo?')) {
      this.modeloService.delete(id).subscribe({
        next: () => {
          this.loadModelos();
          this.notificationService.showSuccess('Modelo excluída com sucesso!');
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
      this.loadModelos();
      this.loadCount();
      return;
    }
    
    this.loading = true;
    this.modeloService.getByNome(termo).subscribe({
      next: (data) => {
        this.modelos = data; 
        this.totalModelos  = data.length;
        this.page = 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching modelos: ', error);
        this.loading = false;
      }
    });
  }
  
  loadCount(): void {
    this.modeloService.count().subscribe(data => {
      this.totalModelos  = data;
      console.log('Total de modelos: ', this.totalModelos );
    })
  }

  paginar(event: PageEvent): void {
    if (this.searchTerm.trim() === '') {
      this.page = event.pageIndex;
      this.pageSize = event.pageSize;
      this.loadModelos();
      console.log(`Página alterada: ${this.page}, Tamanho da página: ${this.pageSize}, Total de modelos: ${this.totalModelos }`);
    } else {
      // Se estiver em modo de busca, podemos apenas mostrar um aviso
        console.warn('A paginação está desativada durante a busca.');
    }
  }
}
