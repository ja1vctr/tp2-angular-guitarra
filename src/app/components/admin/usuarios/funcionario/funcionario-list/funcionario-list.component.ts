import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Funcionario } from '../../../../../model/usuario/funcionario';
import { NotificationService } from '../../../../../service/notification/notification.service';
import { FuncionarioService } from '../../../../../service/usuario/funcionario.service';

@Component({
  selector: 'app-funcionario-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './funcionario-list.component.html',
  styleUrl: './funcionario-list.component.scss',
})
export class FuncionarioListComponent implements OnInit {
  funcionarios: Funcionario[] = [];
  loading = false;

  totalRecords = 0;
  pageSize = 10;
  page = 0;

  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(
    private funcionarioService: FuncionarioService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.setupSearchStream();
    this.loadFuncionarios();
    this.loadCount();
  }

  loadFuncionarios(): void {
    this.loading = true;
    this.funcionarioService.getAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.funcionarios = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading funcionarios: ', err);
        this.loading = false;
      },
    });
  }

  loadCount(): void {
    this.funcionarioService.count().subscribe((data) => (this.totalRecords = data));
  }

  navigateToCreate(): void {
    this.router.navigate(['/admin/usuario/funcionarios/create']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/admin/usuario/funcionarios/edit', id]);
  }

  deleteFuncionario(id: number): void {
    if (confirm('Tem certeza que deseja excluir este funcionário?')) {
      this.funcionarioService.delete(id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Funcionário excluído com sucesso!');
          this.loadFuncionarios();
          this.loadCount();
        },
        error: (err) => {
          console.error('Erro ao excluir funcionário', err);
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
      this.loadFuncionarios();
      this.loadCount();
      return;
    }
    this.loading = true;
    this.funcionarioService.getByNome(term).subscribe({
      next: (data) => {
        this.funcionarios = data;
        this.totalRecords = data.length;
        this.page = 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error searching funcionarios: ', err);
        this.loading = false;
      },
    });
  }

  paginar(event: PageEvent): void {
    if (this.searchTerm.trim() === '') {
      this.page = event.pageIndex;
      this.pageSize = event.pageSize;
      this.loadFuncionarios();
    } else {
      console.warn('A paginação está desativada durante a busca.');
    }
  }
}
