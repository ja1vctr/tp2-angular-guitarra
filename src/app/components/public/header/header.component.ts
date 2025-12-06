import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { GuitarraSearchService } from '../../../service/produto/guitarra-search.service';
import { AuthService } from '../../../service/auth/auth.service';
import { AuthUser } from '../../../model/auth/auth-response';
import { CartService } from '../../../service/cart/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatPaginatorModule,
    MatMenuModule,
    FormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent { 
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  userName: string | null = null;
  avatarUrl: string | null = null;
  initials: string = '';
  constructor(
    private guitarraSearch: GuitarraSearchService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private cart: CartService
  ) {}

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
      this.guitarraSearch.setQuery(novoTermo);
    }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/perfil']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  openCart(): void {
    this.cart.toggleCart();
  }

  ngOnInit(): void {
    this.setUserInfo(this.authService.getUser());
    this.authService.user$.subscribe((user) => this.setUserInfo(user));
  }

  private setUserInfo(user: AuthUser | null): void {
    // Regra: funcionário não aparece logado no front público
    const roles = (user?.roles || []).map(r => r.toUpperCase());
    const isFuncionarioOnly = roles.length > 0 && roles.every(r => r === 'FUNCIONARIO');

    if (!user || isFuncionarioOnly) {
      this.userName = null;
      if (this.avatarUrl) {
        URL.revokeObjectURL(this.avatarUrl);
      }
      this.avatarUrl = null;
      this.initials = 'U';
      return;
    }

    this.userName = user.nome || user.email || null;
    if (this.avatarUrl) {
      URL.revokeObjectURL(this.avatarUrl);
    }
    this.avatarUrl = null;
    this.initials = this.buildInitials(this.userName);
    this.fetchUserImage(user);
  }

    private buildInitials(name?: string | null): string {
      if (!name) return 'U';
      const parts = name.trim().split(/\s+/);
      const first = parts[0]?.[0] || '';
      const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
      return (first + last || first || 'U').toUpperCase();
    }

    private fetchUserImage(user: AuthUser | null): void {
      if (!user?.id) return;
      const roles = (user.roles || []).map(r => r.toUpperCase());
      const endpoints: string[] = [];
      if (roles.includes('CLIENTE')) {
        endpoints.push(`/clientes/imagem/${user.id}/url`);
      }
      if (roles.includes('FUNCIONARIO')) {
        endpoints.push(`/funcionarios/imagem/${user.id}/url`);
      }

      endpoints.forEach((endpoint) => {
        const url = `${environment.apiUrl}${endpoint}`;
        this.http.get(url, { responseType: 'blob' }).subscribe({
          next: (blob) => {
            const objUrl = URL.createObjectURL(blob);
            this.avatarUrl = objUrl;
          },
          error: () => {
            // mantém placeholder
          }
        });
      });
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
