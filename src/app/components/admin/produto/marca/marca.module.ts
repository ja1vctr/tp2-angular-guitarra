import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MarcaListComponent } from './marca-list/marca-list.component';
import { MarcaFormComponent } from './marca-form/marca-form.component';

const routes: Routes = [
  { path: '', component: MarcaListComponent },
  { path: 'create', component: MarcaFormComponent },
  { path: 'edit/:id', component: MarcaFormComponent },
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MarcaListComponent,
    MarcaFormComponent,
  ],
})
export class MarcaModule { }
