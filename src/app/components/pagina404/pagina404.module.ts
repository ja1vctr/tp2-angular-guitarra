import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { Pagina404Component } from './pagina404.component';

const routes: Routes = [
  { path: '', component: Pagina404Component },

];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    Pagina404Component
  ],
})
export class BracoModule { }