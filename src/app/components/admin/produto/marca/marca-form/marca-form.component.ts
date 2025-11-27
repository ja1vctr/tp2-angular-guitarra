import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../service/notification/notification.service';
import { MarcaService } from '../../../../../service/produto/marca.service';
import { ModeloAssociacaoModalComponent } from '../modelo-associacao-modal/modelo-associacao-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-marca-form',
  imports: [
    ReactiveFormsModule, 
    MatSlideToggleModule, 
    CommonModule,
    MatCardModule, 
    MatDatepickerModule,
    MatDialogModule
  ],
  templateUrl: './marca-form.component.html',
  styleUrl: './marca-form.component.scss'
})
export class MarcaFormComponent {
  loading = false;
  marcaForm: FormGroup;
  error: string | null = null;
  marcaId: number | null = null;
  backendErrorsList: any[] = [];
  dataSelecionada: Date | null = null;
  listaModelos: any[] = [];

  constructor(
    private router:              Router,
    private marcaService:        MarcaService,
    private fb:                  FormBuilder,
    private route:               ActivatedRoute,
    private notificationService: NotificationService,
    private cdr:                 ChangeDetectorRef,
    private dialog:              MatDialog,
  ) 
  { 
    
    this.marcaForm = this.fb.group({
    id: [null],
    nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    cnpj: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.marcaId = +idParam;
        this.loadMarca(this.marcaId);
      }
    })
  }

  loadMarca(id: number): void {
    this.loading = true;
    this.marcaService.getById(id).subscribe({
      next: (data) => {
        this.marcaForm.patchValue({
          id: data.id,
          nome: data.nome,
          cnpj: data.cnpj,
        });  

        this.marcaService.getModelosByMarcaId(id).subscribe(modelos => {
          this.listaModelos = modelos;
          this.cdr.detectChanges();
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error.message || 'Erro ao carregar o marca.';
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.marcaForm.invalid) {
      this.marcaForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    
    const marcaData = this.marcaForm.value;

    const saveOperation = this.marcaId
      ? this.marcaService.alter(marcaData)
      : this.marcaService.create(marcaData);

    saveOperation.subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.showSuccess(this.marcaId ? 'Marca atualizado com sucesso!' : 'Marca criado com sucesso!');
        this.router.navigate(['/admin/marcas']);
      },
      error: (error) => {
        this.loading = false;

        console.error('Erro ao salvar o marca:', error.error);
      }
    });
  }

  abrirModalAssociacao(modelo: any) {
    const dialogRef = this.dialog.open(ModeloAssociacaoModalComponent, {
      width: '800px',
      data: {
        modeloId: modelo.id,
        marcaId: this.marcaId
      }
    });

    dialogRef.afterClosed().subscribe((atualizado: any) => {
      if (atualizado) {
        // Recarrega modelos da marca
        this.marcaService.getModelosByMarcaId(this.marcaId!)
          .subscribe(modelos => this.listaModelos = modelos);
      }
    });
  }


  onCancel(): void {
    this.router.navigate(['/admin/marcas']);
  }
}
