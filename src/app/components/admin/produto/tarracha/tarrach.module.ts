import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TarrachaListComponent } from './tarracha-list/tarracha-list.component';
import { TarrachaFormComponent } from './tarracha-form/tarracha-form.component';

const routes: Routes = [
  { path: '', component: TarrachaListComponent },
  { path: 'create', component: TarrachaFormComponent },
  { path: 'edit/:id', component: TarrachaFormComponent },
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TarrachaListComponent,
    TarrachaFormComponent,
  ],
})
export class TarrachaModule { }
