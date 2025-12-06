import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  stats = [
    {
      label: 'Faturamento',
      value: 'R$ --',
      detail: 'Em breve, overview diario.',
    },
    { label: 'Vendas', value: '--', detail: 'Total de pedidos do dia.' },
    { label: 'Produtos ativos', value: '--', detail: 'Guitarras publicadas.' },
  ];

  shortcuts = [
    { label: 'Cadastrar Guitarra', icon: '🎸', link: '/admin/guitarras' },
    { label: 'Clientes', icon: '👥', link: '/admin/usuario/clientes' },
    { label: 'Funcioários', icon: '📦', link: '/admin/usuario/funcionarios' },
  ];

  constructor(private router: Router) {}
}
