import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CorListComponent } from './cor-list/cor-list.component';
import { CorFormComponent } from './cor-form/cor-form.component';

const routes: Routes = [
  { path: '', component: CorListComponent },
  { path: 'create', component: CorFormComponent },
  { path: 'edit/:id', component: CorFormComponent },
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CorListComponent,
    CorFormComponent,
  ],
})
export class CorModule { }
