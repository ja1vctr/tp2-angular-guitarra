import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { GuitarraListComponent } from './guitarra-list/guitarra-list.component';
import { GuitarraFormComponent } from './guitarra-form/guitarra-form.component';

const routes: Routes = [
  { path: '', component: GuitarraListComponent },
  { path: 'create', component: GuitarraFormComponent },
  { path: 'edit/:id', component: GuitarraFormComponent },
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GuitarraListComponent,
    GuitarraFormComponent,
  ],
})
export class GuitarraModule { }
