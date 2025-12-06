import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../../../../model/usuario/cliente';
import { ClienteService } from '../../../../../service/usuario/cliente.service';
import { NotificationService } from '../../../../../service/notification/notification.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cliente-form.component.html',
  styleUrl: './cliente-form.component.scss',
})
export class ClienteFormComponent implements OnInit {
  loading = false;
  clienteForm: FormGroup;
  clienteId: number | null = null;
  error: string | null = null;
  imagemPreview: string | null = null;
  imagemArquivo: File | null = null;
  showResetModal = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private notification: NotificationService
  ) {
    this.clienteForm = this.fb.group({
      id: [null],
      permitirMarketing: [false, [Validators.required]],
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(80),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      dataNascimento: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        this.clienteId = +idParam;
        this.loadCliente(this.clienteId);
      }
    });
  }

  loadCliente(id: number): void {
    this.loading = true;
    this.clienteService.getById(id).subscribe({
      next: (cliente) => {
        this.patchForm(cliente);
        this.loadImagem(id);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Erro ao carregar cliente.';
      },
    });
  }

  private loadImagem(id: number): void {
    this.clienteService.getImagem(id).subscribe({
      next: (blob) => {
        this.imagemPreview = URL.createObjectURL(blob);
      },
      error: () => {
        this.imagemPreview = null;
      },
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
    if (!this.clienteId) {
      this.notification.showError('Salve o cliente antes de enviar imagem.');
      return;
    }
    if (!this.imagemArquivo) {
      this.notification.showError('Nenhum arquivo selecionado.');
      return;
    }
    this.loading = true;
    this.clienteService
      .uploadImagem(this.clienteId, this.imagemArquivo)
      .subscribe({
        next: () => {
          this.loading = false;
          this.notification.showSuccess('Imagem enviada com sucesso.');
          this.loadImagem(this.clienteId!);
          this.imagemArquivo = null;
        },
        error: (err) => {
          this.loading = false;
          this.notification.showError(
            err?.error?.message || 'Erro ao enviar imagem.'
          );
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
    link.download = `cliente_${this.clienteId || 'novo'}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private patchForm(cliente: Cliente): void {
    this.clienteForm.patchValue({
      ...cliente,
      permitirMarketing: cliente.permitirMarketing,
      dataNascimento: cliente.dataNascimento
        ? cliente.dataNascimento.toString().split('T')[0]
        : '',
    });
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload: Cliente = { ...this.clienteForm.value };
    if (!this.clienteId) {
      payload.senha = '123456';
    }

    const request = this.clienteId
      ? this.clienteService.alter(payload)
      : this.clienteService.create(payload);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.notification.showSuccess(
          this.clienteId
            ? 'Cliente atualizado com sucesso!'
            : 'Cliente criado com sucesso!'
        );
        this.router.navigate(['/admin/usuario/clientes']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Erro ao salvar cliente.';
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/usuario/clientes']);
  }

  openResetModal(): void {
    if (!this.clienteId) return;
    this.showResetModal = true;
  }

  closeResetModal(): void {
    this.showResetModal = false;
  }

  confirmResetSenha(): void {
    if (!this.clienteId) return;
    this.loading = true;
    this.clienteService.resetarSenha(this.clienteId).subscribe({
      next: () => {
        this.loading = false;
        this.notification.showSuccess('Senha resetada para o padrão.');
        this.closeResetModal();
      },
      error: (err) => {
        this.loading = false;
        this.notification.showError(
          err?.error?.message || 'Erro ao resetar senha.'
        );
        this.closeResetModal();
      },
    });
  }
}
