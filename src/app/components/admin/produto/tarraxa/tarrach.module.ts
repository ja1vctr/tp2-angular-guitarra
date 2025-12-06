import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TarraxaListComponent } from './tarraxa-list/tarraxa-list.component';
import { TarraxaFormComponent } from './tarraxa-form/tarraxa-form.component';

const routes: Routes = [
  { path: '', component: TarraxaListComponent },
  { path: 'create', component: TarraxaFormComponent },
  { path: 'edit/:id', component: TarraxaFormComponent },
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TarraxaListComponent,
    TarraxaFormComponent,
  ],
})
export class TarraxaModule { }
