import { Routes } from '@angular/router';
import { AdminTemplateComponent } from './components/admin/admin-template/admin-template.component';
import { PublicTemplateComponent } from './components/public/public-template/public-template.component';
import { CardComponent } from './components/public/produto/card/card.component';
import { HomeComponent } from './components/admin/home/home.component';
import { Pagina404Component } from './components/pagina404/pagina404.component';
import { BracoListComponent } from './components/admin/produto/braco/braco-list/braco-list.component';

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
      }
    ],
  },
  {
    path: 'admin',
    component: AdminTemplateComponent,
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
        path: 'cores',
        loadChildren: () => import('./components/admin/produto/cor/cor.module').then(m => m.CorModule),
      },
      {
        path: 'bracos',
        loadChildren: () => import('./components/admin/produto/braco/braco.module').then(m => m.BracoModule)
      },
      {
        path: 'captadores',
        loadChildren: () => import('./components/admin/produto/captador/captador.module').then(m => m.CaptadorModule)
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
        path: 'tarrachas',
        loadChildren: () => import('./components/admin/produto/tarracha/tarrach.module').then(m => m.TarrachaModule)
      },
    ]
  },
  {
    path: '**',
    component: Pagina404Component,
  }
];
