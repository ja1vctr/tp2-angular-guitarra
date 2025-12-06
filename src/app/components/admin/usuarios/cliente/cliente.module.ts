import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';

const routes: Routes = [
  { path: '', component: ClienteListComponent },
  { path: 'create', component: ClienteFormComponent },
  { path: 'edit/:id', component: ClienteFormComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes), ClienteListComponent, ClienteFormComponent],
  exports: [RouterModule],
})
export class ClienteModule {}
