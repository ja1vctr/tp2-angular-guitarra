import { Routes } from '@angular/router';
import { AdminTemplateComponent } from './components/admin/admin-template/admin-template.component';
import { PublicTemplateComponent } from './components/public/public-template/public-template.component';
import { Pagina404Component } from './components/pagina404/pagina404.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicTemplateComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'home', 
        loadComponent: () => import('./components/public/home/home.component').then(c => c.HomeComponent),
      },
      {
        path: 'login',
        loadComponent: () => import('./components/public/auth/login/login.component').then(c => c.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./components/public/auth/register/register.component').then(c => c.RegisterComponent),
      },
      {
        path: 'perfil',
        canActivate: [authGuard],
        data: { roles: ['CLIENTE'] },
        loadComponent: () => import('./components/public/perfil-cliente/perfil-cliente.component').then(c => c.PerfilClienteComponent),
      },
      {
        path: 'produto/:id',
        loadComponent: () => import('./components/public/produto/detalhe/detalhe.component').then(c => c.DetalheComponent),
      },
    ],
  },
  {
    path: 'admin',
    component: AdminTemplateComponent,
    canActivate: [authGuard],
    data: { roles: ['FUNCIONARIO'] },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'home',
        loadComponent: () => import('./components/admin/home/home.component').then(c => c.HomeComponent),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./components/admin/perfil/perfil.component').then(c => c.PerfilComponent),
      },
      {
        path: 'bracos',
        loadChildren: () => import('./components/admin/produto/braco/braco.module').then(m => m.BracoModule)
      },
      {
        path: 'cores',
        loadChildren: () => import('./components/admin/produto/cor/cor.module').then(m => m.CorModule),
      },
      {
        path: 'captadores',
        loadChildren: () => import('./components/admin/produto/captador/captador.module').then(m => m.CaptadorModule)
      },
      {
        path: 'guitarras',
        loadChildren: () => import('./components/admin/produto/guitarra/guitarra.module').then(m => m.GuitarraModule)
      },
      {
        path: 'marcas',
        loadChildren: () => import('./components/admin/produto/marca/marca.module').then(m => m.MarcaModule)
      },
      {
        path: 'modelos',
        loadChildren: () => import('./components/admin/produto/modelo/modelo.module').then(m => m.ModeloModule)
      },
      {
        path: 'pontes',
        loadChildren: () => import('./components/admin/produto/ponte/ponte.module').then(m => m.PonteModule)
      },
      {
        path: 'tarraxas',
        loadChildren: () => import('./components/admin/produto/tarraxa/tarrach.module').then(m => m.TarraxaModule)
      },
      {
        path: 'usuario/clientes',
        loadChildren: () => import('./components/admin/usuarios/cliente/cliente.module').then(m => m.ClienteModule)
      },
      {
        path: 'usuario/funcionarios',
        loadChildren: () => import('./components/admin/usuarios/funcionario/funcionario.module').then(m => m.FuncionarioModule)
      },
    ]
  },
  {
    path: '**',
    component: Pagina404Component,
  }
];
