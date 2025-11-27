import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../service/notification/notification.service';
import { CaptadorService } from '../../../../../service/produto/captador.service';

@Component({
  selector: 'app-captador-form',
  providers: [
    provideNativeDateAdapter(),
  ],
  imports: [
    ReactiveFormsModule, 
    MatSlideToggleModule, 
    CommonModule,
    MatCardModule, 
    MatDatepickerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './captador-form.component.html',
  styleUrl: './captador-form.component.scss'
})
export class CaptadorFormComponent {
  loading = false;
  captadorForm: FormGroup;
  error: string | null = null;
  captadorId: number | null = null;
  backendErrorsList: any[] = [];
  dataSelecionada: Date | null = null;

  constructor(
    private router:              Router,
    private captadorService:     CaptadorService,
    private fb:                  FormBuilder,
    private route:               ActivatedRoute,
    private notificationService: NotificationService,
    private cdr:                 ChangeDetectorRef,
  ) 
  { 
    
    this.captadorForm = this.fb.group({
    id: [null],
    marca: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    modelo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    posicao: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.captadorId = +idParam;
        this.loadCaptador(this.captadorId);
      }
    })
  }

  loadCaptador(id: number): void {
    this.loading = true;
    this.captadorService.getById(id).subscribe({
      next: (data) => {
        this.captadorForm.patchValue({
          id: data.id,
          marca: data.marca,
          modelo: data.modelo,
          posicao: data.posicao?.id ?? null,
        });  

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error.message || 'Erro ao carregar o captador.';
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.captadorForm.invalid) {
      this.captadorForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    
    const captadorData = this.captadorForm.value;

    const saveOperation = this.captadorId
      ? this.captadorService.alter(captadorData)
      : this.captadorService.create(captadorData);

    saveOperation.subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.showSuccess(this.captadorId ? 'Captador atualizado com sucesso!' : 'Captador criado com sucesso!');
        this.router.navigate(['/admin/captadores']);
      },
      error: (error) => {
        this.loading = false;

        console.error('Erro ao salvar o captador:', error.error);
      }
    });
  }

  onDateSelected(date: Date | null): void {
    this.dataSelecionada = date;
    if (date) {
      const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
      this.captadorForm.get('dataDeFabricacao')?.setValue(formattedDate);
    } else {
      this.captadorForm.get('dataDeFabricacao')?.reset();
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/captadores']);
  }
}
