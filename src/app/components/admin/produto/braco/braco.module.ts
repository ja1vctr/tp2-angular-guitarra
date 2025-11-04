import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BracoListComponent } from './braco-list/braco-list.component';
import { BracoFormComponent } from './braco-form/braco-form.component';

const routes: Routes = [
  { path: '', component: BracoListComponent },
  { path: 'create', component: BracoFormComponent },
  { path: 'edit/:id', component: BracoFormComponent },
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BracoListComponent,
    BracoFormComponent,
  ],
})
export class BracoModule { }
