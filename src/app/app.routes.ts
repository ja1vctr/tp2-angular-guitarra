import { Routes } from '@angular/router';
import { AdminTemplateComponent } from './components/admin/admin-template/admin-template.component';
import { PublicTemplateComponent } from './components/public/public-template/public-template.component';
import { CardComponent } from './components/public/produto/card/card.component';
import { HomeComponent } from './components/admin/home/home.component';

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
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
