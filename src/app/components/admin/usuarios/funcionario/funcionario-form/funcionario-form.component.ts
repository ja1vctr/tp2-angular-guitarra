import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Funcionario } from '../../../../../model/usuario/funcionario';
import { NotificationService } from '../../../../../service/notification/notification.service';
import { FuncionarioService } from '../../../../../service/usuario/funcionario.service';

@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './funcionario-form.component.html',
  styleUrl: './funcionario-form.component.scss',
})
export class FuncionarioFormComponent implements OnInit {
  loading = false;
  funcionarioForm: FormGroup;
  funcionarioId: number | null = null;
  error: string | null = null;
  imagemPreview: string | null = null;
  imagemArquivo: File | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private funcionarioService: FuncionarioService,
    private notification: NotificationService
  ) {
    this.funcionarioForm = this.fb.group({
      id: [null],
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      cargo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      salario: [null, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.minLength(6)]],
      dataNascimento: ['', Validators.required],
      dataAdmissao: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.funcionarioId = +idParam;
        this.loadFuncionario(this.funcionarioId);
        this.funcionarioForm.get('senha')?.clearValidators();
        this.funcionarioForm.get('senha')?.updateValueAndValidity({ emitEvent: false });
      } else {
        this.funcionarioForm.get('senha')?.addValidators([Validators.required]);
        this.funcionarioForm.get('senha')?.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  loadFuncionario(id: number): void {
    this.loading = true;
    this.funcionarioService.getById(id).subscribe({
      next: (funcionario) => {
        this.patchForm(funcionario);
        this.loadImagem(id);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Erro ao carregar funcionário.';
      },
    });
  }

  private loadImagem(id: number): void {
    this.funcionarioService.getImagem(id).subscribe({
      next: (blob) => {
        this.imagemPreview = URL.createObjectURL(blob);
      },
      error: () => {
        this.imagemPreview = null;
      },
    });
  }

  private patchForm(funcionario: Funcionario): void {
    this.funcionarioForm.patchValue({
      ...funcionario,
      dataNascimento: funcionario.dataNascimento
        ? (funcionario.dataNascimento as any).toString().split('T')[0]
        : '',
      dataAdmissao: funcionario.dataAdmissao
        ? (funcionario.dataAdmissao as any).toString().split('T')[0]
        : '',
      salario: funcionario.salario
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      if (!file.type.match('image.*')) {
        this.notification.showError('Selecione um arquivo de imagem.');
        input.value = '';
        return;
      }
      this.imagemArquivo = file;
      if (this.imagemPreview) {
        URL.revokeObjectURL(this.imagemPreview);
      }
      this.imagemPreview = URL.createObjectURL(file);
    }
  }

  onUploadImagem(): void {
    if (!this.funcionarioId) {
      this.notification.showError('Salve o funcionário antes de enviar imagem.');
      return;
    }
    if (!this.imagemArquivo) {
      this.notification.showError('Nenhum arquivo selecionado.');
      return;
    }
    this.loading = true;
    this.funcionarioService.uploadImagem(this.funcionarioId, this.imagemArquivo).subscribe({
      next: () => {
        this.loading = false;
        this.notification.showSuccess('Imagem enviada com sucesso.');
        this.loadImagem(this.funcionarioId!);
        this.imagemArquivo = null;
      },
      error: (err) => {
        this.loading = false;
        this.notification.showError(err?.error?.message || 'Erro ao enviar imagem.');
      },
    });
  }

  onDownloadImagem(): void {
    if (!this.imagemPreview) {
      this.notification.showError('Nenhuma imagem para download.');
      return;
    }
    const link = document.createElement('a');
    link.href = this.imagemPreview;
    link.download = `funcionario_${this.funcionarioId || 'novo'}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onSubmit(): void {
    if (this.funcionarioForm.invalid) {
      this.funcionarioForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload: Funcionario = { ...this.funcionarioForm.value };
    if (this.funcionarioId && !payload.senha) {
      delete payload.senha;
    }

    const request = this.funcionarioId
      ? this.funcionarioService.alter(payload)
      : this.funcionarioService.create(payload);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.notification.showSuccess(
          this.funcionarioId ? 'Funcionário atualizado com sucesso!' : 'Funcionário criado com sucesso!'
        );
        this.router.navigate(['/admin/usuario/funcionarios']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Erro ao salvar funcionário.';
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/usuario/funcionarios']);
  }
}
