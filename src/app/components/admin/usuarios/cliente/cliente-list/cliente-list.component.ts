import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Cliente } from '../../../../../model/usuario/cliente';
import { ClienteService } from '../../../../../service/usuario/cliente.service';
import { NotificationService } from '../../../../../service/notification/notification.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.scss',
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];
  loading = false;

  totalRecords = 0;
  pageSize = 10;
  page = 0;

  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.setupSearchStream();
    this.loadClientes();
    this.loadCount();
  }

  loadClientes(): void {
    this.loading = true;
    this.clienteService.getAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.clientes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading clientes: ', err);
        this.loading = false;
      },
    });
  }

  loadCount(): void {
    this.clienteService.count().subscribe((data) => (this.totalRecords = data));
  }

  navigateToCreate(): void {
    this.router.navigate(['/admin/usuario/clientes/create']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/admin/usuario/clientes/edit', id]);
  }

  deleteCliente(id: number): void {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clienteService.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Cliente excluído com sucesso!');
          this.loadClientes();
          this.loadCount();
        },
        error: (err) => {
          console.error('Erro ao excluir cliente', err);
        },
      });
    }
  }

  setupSearchStream(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => this.executeSearch(term));
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  executeSearch(term: string): void {
    if (!term.trim()) {
      this.loadClientes();
      this.loadCount();
      return;
    }
    this.loading = true;
    this.clienteService.getByNome(term).subscribe({
      next: (data) => {
        this.clientes = data;
        this.totalRecords = data.length;
        this.page = 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error searching clientes: ', err);
        this.loading = false;
      },
    });
  }

  paginar(event: PageEvent): void {
    if (this.searchTerm.trim() === '') {
      this.page = event.pageIndex;
      this.pageSize = event.pageSize;
      this.loadClientes();
    } else {
      console.warn('A paginação está desativada durante a busca.');
    }
  }
}
