import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FuncionarioListComponent } from './funcionario-list/funcionario-list.component';
import { FuncionarioFormComponent } from './funcionario-form/funcionario-form.component';

const routes: Routes = [
  { path: '', component: FuncionarioListComponent },
  { path: 'create', component: FuncionarioFormComponent },
  { path: 'edit/:id', component: FuncionarioFormComponent },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes), FuncionarioListComponent, FuncionarioFormComponent],
  exports: [RouterModule],
})
export class FuncionarioModule {}
