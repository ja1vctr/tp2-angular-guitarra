import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Guitarra } from '../../../../../model/produto/guitarra';
import { GuitarraService } from '../../../../../service/produto/guitarra.service';
import { NotificationService } from '../../../../../service/notification/notification.service';

@Component({
  selector: 'app-guitarra-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    MatInputModule,
    MatSlideToggleModule,
    FormsModule,
  ],
  templateUrl: './guitarra-list.component.html',
  styleUrl: './guitarra-list.component.scss',
})
export class GuitarraListComponent {
  guitarras: Guitarra[] = [];
  loading = false;

  // PAGINAÇÃO
  totalRecords = 0;
  pageSize = 10;
  page = 0;

  // BUSCA
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  // Armazena URLs de imagens por guitarra (cache)
  imagens: { [id: number]: string } = {};

  constructor(
    private guitarraService: GuitarraService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.setupSearchStream();
    if (this.searchTerm === '') {
      this.loadGuitarras();
    }
    this.loadCount();
  }

  // ================================
  // LISTAGEM
  // ================================
  loadGuitarras() {
    this.loading = true;

    this.guitarraService.getAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.guitarras = data;
        this.loading = false;

        // Carrega imagens após listar
        this.guitarras.forEach((g) => this.carregarImagem(g.id!));
      },
      error: (error) => {
        console.error('Error loading guitarras: ', error);
        this.loading = false;
      },
    });
  }

  loadCount(): void {
    this.guitarraService.count().subscribe((data) => {
      this.totalRecords = data;
    });
  }

  // ================================
  // IMAGEM
  // ================================
  carregarImagem(id: number) {
    if (this.imagens[id]) return;

    this.guitarraService.getImagem(id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.imagens[id] = url;
      },
      error: () => {
        console.warn(`Guitarra ${id} sem imagem.`);
      },
    });
  }

  // ================================
  // NAVEGAÇÃO
  // ================================
  navigateToCreate(): void {
    this.router.navigate(['/admin/guitarras/create']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/admin/guitarras/edit', id]);
  }

  deleteGuitarra(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta guitarra?')) {
      this.guitarraService.delete(id).subscribe({
        next: () => {
          this.loadGuitarras();
          this.notificationService.showSuccess(
            'Guitarra excluída com sucesso!'
          );
        },
        error: (error) => {
          console.error('Erro ao excluir guitarra ' + id + ': ', error);
        },
      });
    }
  }

  // ================================
  // BUSCA
  // ================================
  setupSearchStream(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((termo: string) => {
        this.executeSearch(termo);
      });
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  executeSearch(termo: string): void {
    if (termo.trim() === '') {
      this.loadGuitarras();
      this.loadCount();
      return;
    }
    this.loading = true;
    this.guitarraService.getByNome(termo).subscribe({
      next: (data) => {
        this.guitarras = data;
        this.totalRecords = data.length;
        this.page = 0;
        this.loading = false;
        this.guitarras.forEach((g) => this.carregarImagem(g.id!));
      },
      error: (error) => {
        console.error('Error searching guitarras: ', error);
        this.loading = false;
      },
    });
  }

  // ================================
  // PAGINAÇÃO
  // ================================
  paginar(event: PageEvent): void {
    if (this.searchTerm.trim() === '') {
      this.page = event.pageIndex;
      this.pageSize = event.pageSize;
      this.loadGuitarras();
    } else {
      console.warn('A paginação está desativada durante a busca.');
    }
  }

  // ================================
  // STATUS
  // ================================
  onToggleStatus(guitarra: Guitarra, change: MatSlideToggleChange): void {
    const novoStatus = change.checked;
    const statusAnterior = guitarra.status;
    guitarra.status = novoStatus;

    this.guitarraService.updateStatus(guitarra.id!, novoStatus).subscribe({
      next: () => {
        this.notificationService.showSuccess(
          `Status atualizado para ${novoStatus ? 'disponível' : 'indisponível'}.`
        );
      },
      error: (error) => {
        console.error('Erro ao atualizar status', error);
        guitarra.status = statusAnterior;
        this.notificationService.showError('Não foi possível atualizar o status.');
      },
    });
  }
}
