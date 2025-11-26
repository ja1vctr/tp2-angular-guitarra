import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CaptadorListComponent } from './captador-list/captador-list.component';
import { CaptadorFormComponent } from './captador-form/captador-form.component';

const routes: Routes = [
  { path: '', component: CaptadorListComponent },
  { path: 'create', component: CaptadorFormComponent },
  { path: 'edit/:id', component: CaptadorFormComponent },
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CaptadorListComponent,
    CaptadorFormComponent,
  ],
})
export class CaptadorModule { }
