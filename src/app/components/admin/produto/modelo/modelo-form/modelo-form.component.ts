import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { ModeloService } from '../../../../../service/produto/modelo.service';
import { NotificationService } from '../../../../../service/notification/notification.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MarcaAssociacaoModalComponent } from '../marca-associacao-modal/marca-associacao-modal.component';

@Component({
  selector: 'app-modelo-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSlideToggleModule,
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './modelo-form.component.html',
  styleUrl: './modelo-form.component.scss'
})
export class ModeloFormComponent {

  loading = false;
  marcasLoaded = false;

  modeloForm: FormGroup;
  modeloId: number | null = null;

  listMarcas: any[] = []; // [{id, nome}]

  constructor(
    private router: Router,
    private modeloService: ModeloService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {
    this.modeloForm = this.fb.group({
      id: [null],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.modeloId = +idParam;
        this.loadModelo(this.modeloId);
      }
    });
  }

  loadModelo(id: number): void {
    this.loading = true;
    this.marcasLoaded = false;

    this.modeloService.getById(id).subscribe({
      next: (data) => {
        this.modeloForm.patchValue(data);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.showError('Erro ao carregar modelo.');
      }
    });

    this.modeloService.getMarcasByModeloId(id).subscribe({
      next: (marcas) => {
        this.listMarcas = marcas;
        this.marcasLoaded = true;
      },
      error: () => {
        this.marcasLoaded = true;
        this.notificationService.showError('Erro ao carregar marcas associadas.');
      }
    });
  }

  abrirModalAssociacao() {
    if (!this.modeloId) return;

    const dialogRef = this.dialog.open(MarcaAssociacaoModalComponent, {
      width: '720px',
      data: {
        modeloId: this.modeloId,
        marcasSelecionadas: this.listMarcas.map(m => m.id)
      }
    });

    dialogRef.afterClosed().subscribe((novasAssociacoes: number[] | null) => {
      if (!novasAssociacoes) return;

      // monta payload conforme backend espera
      const payload: any = {
        id: this.modeloId,
        nome: this.modeloForm.get('nome')!.value, // nome atual do form
        idMarcas: novasAssociacoes
      };

      // opcional: bloquear UI
      this.loading = true;

      this.modeloService.alter(payload).subscribe({
        next: () => {
          // recarrega a lista atualizada do backend
          this.modeloService.getMarcasByModeloId(this.modeloId!).subscribe({
            next: (marcas) => {
              this.listMarcas = marcas;
              this.loading = false;
              this.notificationService.showSuccess('Associações atualizadas com sucesso!');
            },
            error: (err) => {
              console.error('Erro ao recarregar marcas:', err);
              this.loading = false;
            }
          });
        },
        error: (err) => {
          console.error('Erro ao atualizar associações:', err);
          this.loading = false;
          this.notificationService.showError('Não foi possível atualizar as associações.');
        }
      });
    });
  }

  onSubmit(): void {
    if (this.modeloForm.invalid) {
      this.modeloForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    // Extrai IDs das marcas associadas
    const idMarcas = this.listMarcas.map(m => m.id);

    // Monta payload conforme backend espera
    const payload: any = {
      nome: this.modeloForm.value.nome,
      idMarcas: idMarcas
    };

    // Se for update, adiciona o ID
    if (this.modeloId) {
      payload.id = this.modeloId;
    }

    const request = this.modeloId
      ? this.modeloService.alter(payload)
      : this.modeloService.create(payload);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.showSuccess(
          this.modeloId ? 'Modelo atualizado!' : 'Modelo criado!'
        );
        this.router.navigate(['/admin/modelos']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao salvar o modelo:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/modelos']);
  }
}
