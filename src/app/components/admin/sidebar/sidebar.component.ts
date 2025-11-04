import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatListModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  userImage = '/assets/user.png'; // URL for user's photo
  userName = 'João Victor';
  userEmail = 'joao.victor@example.com';

  navItemsLoja = [
  { label: 'Dashboard', link: '/admin/home', icon: 'dashboard' },
  { label: 'Usuários', link: '/admin/usuario', icon: 'group' },
  { label: 'Guitarras', link: '/admin/pedido', icon: '' },
  { label: 'Pedidos', link: '/admin/guitarra', icon: '' },
];
  
  navItemsProduto = [
  { label: 'Braços', link: '/admin/bracos', icon: 'edit' },
  { label: 'Captadores', link: '/admin/', icon: 'edit' },
  { label: 'Cores', link: '/admin/cores', icon: 'edit' },
  { label: 'Marcas', link: '/admin/', icon: 'edit' },
  { label: 'Ponte', link: '/admin/', icon: 'edit' },
  { label: 'Tarracha', link: '/admin/', icon: 'edit' },
];
}
