import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatPaginatorModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent { 
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  setupSearchStream(): void {
      this.searchSubject.pipe(
        debounceTime(300), // ESPERA 300ms depois que o usuário para de digitar
        distinctUntilChanged() // Ignora se o termo digitado for o mesmo do anterior
      ).subscribe((searchTerm: string) => {
        // Quando o stream for acionado, chama a função de busca
        // this.executeSearch(searchTerm);
      });
    }
    onSearchChange(novoTermo: string): void {
      // Usa o valor do ngModel para enviar ao Subject
      this.searchSubject.next(novoTermo);
    }
  
    // executeSearch(termo: string): void {
    //   if (termo.trim() === '') {
    //     this.loadBracos();
    //     this.loadCount();
    //     return;
    //   }
  
    //   this.loading = true;
    //   this.bracoService.getByFormato(termo).subscribe({
    //     next: (data) => {
    //       this.bracos = data; 
    //       this.totalRecords = data.length;
    //       this.page = 0;
    //       this.loading = false;
    //     },
    //     error: (error) => {
    //       console.error('Error searching bracos: ', error);
    //       this.loading = false;
    //     }
    //   });
    // }
  

}