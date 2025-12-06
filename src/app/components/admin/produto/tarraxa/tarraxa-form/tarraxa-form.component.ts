import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../service/notification/notification.service';
import { TarraxaService } from '../../../../../service/produto/tarraxa.service';

@Component({
  selector: 'app-tarraxa-form',
  imports: [
    ReactiveFormsModule, 
    MatSlideToggleModule, 
    CommonModule,
    MatCardModule, 
    MatDatepickerModule
  ],
  templateUrl: './tarraxa-form.component.html',
  styleUrl: './tarraxa-form.component.scss'
})
export class TarraxaFormComponent {
  loading = false;
  tarraxaForm: FormGroup;
  error: string | null = null;
  tarraxaId: number | null = null;
  backendErrorsList: any[] = [];
  dataSelecionada: Date | null = null;

  constructor(
    private router:              Router,
    private tarraxaService:      TarraxaService,
    private fb:                  FormBuilder,
    private route:               ActivatedRoute,
    private notificationService: NotificationService,
    private cdr:                 ChangeDetectorRef,
  ) 
  { 
    
    this.tarraxaForm = this.fb.group({
    id: [null],
    marca: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    material: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    modelo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.tarraxaId = +idParam;
        this.loadTarraxa(this.tarraxaId);
      }
    })
  }

  loadTarraxa(id: number): void {
    this.loading = true;
    this.tarraxaService.getById(id).subscribe({
      next: (data) => {
        this.tarraxaForm.patchValue({
          id: data.id,
          marca: data.marca,
          material: data.material,
          modelo: data.modelo,
        });  

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error.message || 'Erro ao carregar o tarraxa.';
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.tarraxaForm.invalid) {
      this.tarraxaForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    
    const tarraxaData = this.tarraxaForm.value;

    const saveOperation = this.tarraxaId
      ? this.tarraxaService.alter(tarraxaData)
      : this.tarraxaService.create(tarraxaData);

    saveOperation.subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.showSuccess(this.tarraxaId ? 'Tarraxa atualizado com sucesso!' : 'Tarraxa criado com sucesso!');
        this.router.navigate(['/admin/tarraxas']);
      },
      error: (error) => {
        this.loading = false;

        console.error('Erro ao salvar o tarraxa:', error.error);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/tarraxas']);
  }
}
