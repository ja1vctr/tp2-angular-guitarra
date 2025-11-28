import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ModeloListComponent } from './modelo-list/modelo-list.component';
import { ModeloFormComponent } from './modelo-form/modelo-form.component';

const routes: Routes = [
  { path: '', component: ModeloListComponent },
  { path: 'create', component: ModeloFormComponent },
  { path: 'edit/:id', component: ModeloFormComponent },
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ModeloListComponent,
    ModeloFormComponent,
  ],
})
export class ModeloModule { }
