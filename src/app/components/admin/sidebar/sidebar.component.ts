import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion'; // NECESSÁRIO para o dropdown
import { Subscription } from 'rxjs';
import { AuthService } from '../../../service/auth/auth.service';
import { AuthUser } from '../../../model/auth/auth-response';
import { FuncionarioService } from '../../../service/usuario/funcionario.service';

// Interface para definir a estrutura dos itens de navegação
interface NavItem {
  label: string;
  link: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule, // Importado aqui
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  userImage = '';
  userName = '';
  userEmail = '';
  private subs: Subscription[] = [];

  // Sinal para controlar a expansão do menu de Usuários
  isUsersMenuExpanded = signal(true);

  toggleUsersMenu() {
    this.isUsersMenuExpanded.update((expanded) => !expanded);
  }

  // Itens de Navegação PRINCIPAIS
  navItemsLoja: NavItem[] = [
    { label: 'Dashboard', link: '/admin/home', icon: 'dashboard' },
    // Removido 'Usuários' daqui, ele será um dropdown
    { label: 'Guitarras', link: '/admin/guitarras', icon: '🎸' },
  ];

  // Itens de Navegação do Dropdown 'Usuários'
  navItemsUsuarios: NavItem[] = [
    {
      label: 'Clientes',
      link: '/admin/usuario/clientes',
      icon: 'person_outline',
    },
    {
      label: 'Funcionários',
      link: '/admin/usuario/funcionarios',
      icon: 'badge',
    },
  ];

  // Itens de Navegação de CONFIGURAÇÃO/PRODUTO
  navItemsProduto: NavItem[] = [
    { label: 'Braços', link: '/admin/bracos', icon: 'handshake' }, // Ícone alterado para mais clareza
    { label: 'Captadores', link: '/admin/captadores', icon: 'mic_external_on' }, // Ícone alterado
    { label: 'Cores', link: '/admin/cores', icon: 'palette' }, // Ícone alterado
    { label: 'Marcas', link: '/admin/marcas', icon: 'corporate_fare' },
    { label: 'Modelos', link: '/admin/modelos', icon: 'category' },
    { label: 'Pontes', link: '/admin/pontes', icon: 'link' }, // Ícone alterado
    { label: 'Tarraxa', link: '/admin/tarraxas', icon: 'tune' }, // Ícone alterado
  ];

  constructor(
    private authService: AuthService,
    private funcionarioService: FuncionarioService
  ) {}

  ngOnInit(): void {
    const sub = this.authService.user$.subscribe((user) => {
      this.atualizarUsuario(user);
    });
    this.subs.push(sub);
    this.atualizarUsuario(this.authService.getCurrentUser());
    this.carregarImagemFuncionarioLogado();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  private atualizarUsuario(user: AuthUser | null): void {
    this.userName = user?.nome ?? 'Usuário';
    this.userEmail = user?.email ?? '';
    const initials = this.gerarIniciais(this.userName);
    this.userImage = `https://placehold.co/40x40/4f46e5/ffffff?text=${initials}`;
  }

  private gerarIniciais(nome: string): string {
    if (!nome) return 'U';
    const parts = nome.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last || first || 'U').toUpperCase();
  }

  private carregarImagemFuncionarioLogado(): void {
    const sub = this.funcionarioService.getLogado().subscribe({
      next: (funcionario) => {
        if (!funcionario?.id) return;
        this.funcionarioService.getImagem(funcionario.id).subscribe({
          next: (blob) => {
            if (this.userImage) {
              URL.revokeObjectURL(this.userImage);
            }
            this.userImage = URL.createObjectURL(blob);
          },
          error: () => {
            // mantém avatar por iniciais como fallback
          },
        });
      },
      error: () => {
        // mantém avatar por iniciais como fallback
      },
    });
    this.subs.push(sub);
  }
}
