import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModeloService } from '../../../../../service/produto/modelo.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-modelo-associacao-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './modelo-associacao-modal.component.html',
  styleUrls: ['./modelo-associacao-modal.component.scss']
})
export class ModeloAssociacaoModalComponent implements OnInit {

  modelo: any = null;
  marcasSelecionadas: any[] = [];
  marcaId!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { modeloId: number, marcaId: number },
    private dialogRef: MatDialogRef<ModeloAssociacaoModalComponent>,
    private modeloService: ModeloService
  ) {}

  ngOnInit(): void {
    this.marcaId = this.data.marcaId;

    this.modeloService.getById(this.data.modeloId).subscribe(modelo => {
      this.modelo = modelo;
    });

      // lista atual de marcas associadas
    this.modeloService.getMarcasByModeloId(this.modelo.id).subscribe(marcas => {
      this.marcasSelecionadas = marcas;
    });
  }

  isMarcaSelecionada(marca: any): boolean {
    return this.marcasSelecionadas.some(m => m.id === marca.id);
  }

  toggleMarca(marca: any) {
    const index = this.marcasSelecionadas.findIndex(m => m.id === marca.id);

    if (index >= 0) {
      this.marcasSelecionadas.splice(index, 1);
    } else {
      this.marcasSelecionadas.push(marca);
    }
  }

  salvar() {
    const payload = {
      id: this.modelo.id,
      nome: this.modelo.nome,
      marcas: this.marcasSelecionadas.map(m => ({ id: m.id }))
    };

    this.modeloService.alter(payload).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.dialogRef.close(false)
    });
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
