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
    cnpj: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(18)]],
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
    this.setupCnpjMask();
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
    
    const marcaData = { ...this.marcaForm.value };

    if (marcaData.cnpj) {
        // Remove todos os caracteres não numéricos antes de enviar para a API
        marcaData.cnpj = marcaData.cnpj.replace(/\D/g, ''); 
    }

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

  /**
   * 1. Configura um listener para o campo CNPJ.
   * Isto permite que a máscara seja aplicada durante a digitação.
   */
  setupCnpjMask(): void {
    const cnpjControl = this.marcaForm.get('cnpj');
    
    if (cnpjControl) {
      cnpjControl.valueChanges.subscribe(rawValue => {
        if (!rawValue) return;

        // Remove caracteres não numéricos para garantir que o valor do formulário
        // permaneça limpo (apenas 14 dígitos).
        const cleanValue = rawValue.replace(/\D/g, '');
        
        // Aplica a formatação visual
        const maskedValue = this.applyCnpjMask(cleanValue);

        // Se o valor mascarado for diferente do valor no controle, atualiza.
        // { emitEvent: false } é crucial para evitar um loop infinito de valueChanges.
        if (maskedValue !== rawValue) {
          cnpjControl.setValue(maskedValue, { emitEvent: false });
        }
      });
    }
  }

  /**
   * 2. Aplica a máscara 00.000.000/0000-00 ao valor limpo.
   */
  applyCnpjMask(value: string): string {
    // 00.000.000/0000-00
    // Limita a 14 caracteres (o que já é feito por Validators.maxLength(14))
    const cleanValue = value.substring(0, 14);

    if (cleanValue.length <= 14) {
      return cleanValue.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        '$1.$2.$3/$4-$5'
      ).replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})$/,
        '$1.$2.$3/$4'
      ).replace(
        /^(\d{2})(\d{3})(\d{3})$/,
        '$1.$2.$3'
      ).replace(
        /^(\d{2})(\d{3})$/,
        '$1.$2'
      ).replace(
        /^(\d{2})$/,
        '$1'
      );
    }
    return cleanValue;
  }


  onCancel(): void {
    this.router.navigate(['/admin/marcas']);
  }
}
