import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ModeloService } from '../../../../../service/produto/modelo.service';
import { MarcaService } from '../../../../../service/produto/marca.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from "@angular/material/checkbox";

@Component({
  selector: 'app-marca-associacao-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  templateUrl: './marca-associacao-modal.component.html',
  styleUrls: ['./marca-associacao-modal.component.scss']
})
export class MarcaAssociacaoModalComponent implements OnInit {

  loading = true;

  todasMarcas: any[] = [];
  marcasAssociadasIds: number[] = [];

  modeloNome = '';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { modeloId: number; marcasSelecionadas: number[] },

    private dialogRef: MatDialogRef<MarcaAssociacaoModalComponent>,
    private modeloService: ModeloService,
    private marcaService: MarcaService
  ) {}

  ngOnInit(): void {
    this.marcasAssociadasIds = [...this.data.marcasSelecionadas]; // cópia independente

    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;

    this.marcaService.getAll().subscribe({
      next: (marcas) => {
        this.todasMarcas = marcas;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar marcas:', err);
        this.loading = false;
      }
    });

    this.modeloService.getById(this.data.modeloId).subscribe({
      next: modelo => this.modeloNome = modelo.nome,
      error: err => console.error(err)
    });
  }

  /** Verifica se a marca está marcada */
  isMarcaAssociada(id: number): boolean {
    return this.marcasAssociadasIds.includes(id);
  }

  /** Marca ou desmarca */
  toggleMarca(id: number, checked: boolean): void {
    if (checked) {
      if (!this.marcasAssociadasIds.includes(id)) {
        this.marcasAssociadasIds.push(id);
      }
    } else {
      this.marcasAssociadasIds = this.marcasAssociadasIds.filter(m => m !== id);
    }
  }

  /** Retorna ao componente pai a lista final de IDs */
  confirmarAssociacao(): void {
    this.dialogRef.close(this.marcasAssociadasIds);
  }

  fechar(): void {
    this.dialogRef.close(null);
  }
}
