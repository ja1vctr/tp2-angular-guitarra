import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { CorService } from '../../../../../service/produto/cor.service';
import { NotificationService } from '../../../../../service/notification/notification.service';

@Component({
  selector: 'app-cor-form',
  imports: [
    ReactiveFormsModule, 
    MatSlideToggleModule, 
    CommonModule
  ],
  templateUrl: './cor-form.component.html',
  styleUrl: './cor-form.component.scss'
})
export class CorFormComponent implements OnInit {
  loading = false;
  corForm: FormGroup;
  error: string | null = null;
  corId: number | null = null;
  backendErrorsList: any[] = [];

  constructor(
    private router:              Router,
    private corService:          CorService,
    private fb:                  FormBuilder,
    private route:               ActivatedRoute,
    private notificationService: NotificationService
  ) 
  {
    this.corForm = this.fb.group({
    id: [null],
    nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    codigoHexadecimal: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(7), 
        Validators.pattern(/^#?([A-Fa-f0-9]{6})$/)
      ]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.corId = +idParam;
        this.loadCor(this.corId);
      }
    })
  }

  loadCor(id: number): void {
    this.loading = true;
    this.corService.getById(id).subscribe({
      next: (data) => {
        this.corForm.patchValue(data);  
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error.message || 'Erro ao carregar a cor.';
      }
    });
  }

  onSubmit(): void {
    if (this.corForm.invalid) {
      this.corForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;
    
    const corData = this.corForm.value;

    const saveOperation = this.corId
      ? this.corService.alter(corData)
      : this.corService.create(corData);

    saveOperation.subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.showSuccess(this.corId ? 'Cor atualizada com sucesso!' : 'Cor criada com sucesso!');
        this.router.navigate(['/admin/cores']);
      },
      error: (error) => {
        this.loading = false;

        console.error('Erro ao salvar a cor:', error.error);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/cores']);
  }
}
