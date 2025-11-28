import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PonteListComponent } from './ponte-list/ponte-list.component';
import { PonteFormComponent } from './ponte-form/ponte-form.component';

const routes: Routes = [
  { path: '', component: PonteListComponent },
  { path: 'create', component: PonteFormComponent },
  { path: 'edit/:id', component: PonteFormComponent },
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PonteListComponent,
    PonteFormComponent,
  ],
})
export class PonteModule { }
