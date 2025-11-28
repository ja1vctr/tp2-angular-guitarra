import { CommonModule, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../../service/notification/notification.service';
import { TarrachaService } from '../../../../../service/produto/tarracha.service';

@Component({
  selector: 'app-tarracha-form',
  imports: [
    ReactiveFormsModule, 
    MatSlideToggleModule, 
    CommonModule,
    MatCardModule, 
    MatDatepickerModule
  ],
  templateUrl: './tarracha-form.component.html',
  styleUrl: './tarracha-form.component.scss'
})
export class TarrachaFormComponent {
  loading = false;
  tarrachaForm: FormGroup;
  error: string | null = null;
  tarrachaId: number | null = null;
  backendErrorsList: any[] = [];
  dataSelecionada: Date | null = null;

  constructor(
    private router:              Router,
    private tarrachaService:        TarrachaService,
    private fb:                  FormBuilder,
    private route:               ActivatedRoute,
    private notificationService: NotificationService,
    private cdr:                 ChangeDetectorRef,
  ) 
  { 
    
    this.tarrachaForm = this.fb.group({
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
        this.tarrachaId = +idParam;
        this.loadTarracha(this.tarrachaId);
      }
    })
  }

  loadTarracha(id: number): void {
    this.loading = true;
    this.tarrachaService.getById(id).subscribe({
      next: (data) => {
        this.tarrachaForm.patchValue({
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
        this.error = error.error.message || 'Erro ao carregar o tarracha.';
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.tarrachaForm.invalid) {
      this.tarrachaForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    
    const tarrachaData = this.tarrachaForm.value;

    const saveOperation = this.tarrachaId
      ? this.tarrachaService.alter(tarrachaData)
      : this.tarrachaService.create(tarrachaData);

    saveOperation.subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.showSuccess(this.tarrachaId ? 'Tarracha atualizado com sucesso!' : 'Tarracha criado com sucesso!');
        this.router.navigate(['/admin/tarrachas']);
      },
      error: (error) => {
        this.loading = false;

        console.error('Erro ao salvar o tarracha:', error.error);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/tarrachas']);
  }
}
