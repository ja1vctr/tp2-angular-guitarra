import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../service/notification/notification.service';
import { PonteService } from '../../../../../service/produto/ponte.service';

@Component({
  selector: 'app-ponte-form',
  imports: [
    ReactiveFormsModule, 
    MatSlideToggleModule, 
    CommonModule,
    MatCardModule, 
    MatDatepickerModule
  ],
  templateUrl: './ponte-form.component.html',
  styleUrl: './ponte-form.component.scss'
})
export class PonteFormComponent {
  loading = false;
  ponteForm: FormGroup;
  error: string | null = null;
  ponteId: number | null = null;
  backendErrorsList: any[] = [];
  dataSelecionada: Date | null = null;

  constructor(
    private router:              Router,
    private ponteService:     PonteService,
    private fb:                  FormBuilder,
    private route:               ActivatedRoute,
    private notificationService: NotificationService,
    private cdr:                 ChangeDetectorRef,
  ) 
  { 
    
    this.ponteForm = this.fb.group({
    id: [null],
    marca: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    modelo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.ponteId = +idParam;
        this.loadPonte(this.ponteId);
      }
    })
  }

  loadPonte(id: number): void {
    this.loading = true;
    this.ponteService.getById(id).subscribe({
      next: (data) => {
        this.ponteForm.patchValue({
          id: data.id,
          marca: data.marca,
          modelo: data.modelo,
        });  

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error.message || 'Erro ao carregar o ponte.';
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.ponteForm.invalid) {
      this.ponteForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    
    const ponteData = this.ponteForm.value;

    const saveOperation = this.ponteId
      ? this.ponteService.alter(ponteData)
      : this.ponteService.create(ponteData);

    saveOperation.subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.showSuccess(this.ponteId ? 'Ponte atualizado com sucesso!' : 'Ponte criado com sucesso!');
        this.router.navigate(['/admin/pontes']);
      },
      error: (error) => {
        this.loading = false;

        console.error('Erro ao salvar o ponte:', error.error);
      }
    });
  }

  onDateSelected(date: Date | null): void {
    this.dataSelecionada = date;
    if (date) {
      const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
      this.ponteForm.get('dataDeFabricacao')?.setValue(formattedDate);
    } else {
      this.ponteForm.get('dataDeFabricacao')?.reset();
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/pontes']);
  }
}
