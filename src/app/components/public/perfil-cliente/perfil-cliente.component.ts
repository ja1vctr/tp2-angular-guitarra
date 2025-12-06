import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { Cliente } from '../../../model/usuario/cliente';
import { NotificationService } from '../../../service/notification/notification.service';
import { ClienteLogadoService } from '../../../service/usuario/cliente-logado.service';

@Component({
  selector: 'app-perfil-cliente',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './perfil-cliente.component.html',
  styleUrl: './perfil-cliente.component.scss',
})
export class PerfilClienteComponent implements OnInit, OnDestroy {
  perfilForm!: FormGroup;
  senhaForm!: FormGroup;
  emailForm!: FormGroup;
  loading = false;
  cliente?: Cliente;
  imagemPreview: string | null = null;
  imagemArquivo: File | null = null;
  showEmailModal = false;
  showSenhaModal = false;
  private subs: Subscription[] = [];

  readonly placeholder = 'assets/user.png';

  constructor(
    private fb: FormBuilder,
    private service: ClienteLogadoService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.buildForms();
    this.carregarPerfil();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    if (this.imagemPreview) {
      URL.revokeObjectURL(this.imagemPreview);
    }
  }

  private buildForms(): void {
    this.perfilForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      dataNascimento: ['', Validators.required],
      permitirMarketing: [false],
    });

    this.senhaForm = this.fb.group({
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
    });

    this.emailForm = this.fb.group({
      novoEmail: ['', [Validators.required, Validators.email]],
    });
  }

  private carregarPerfil(): void {
    this.loading = true;
    const sub = this.service.get().subscribe({
      next: (resp) => {
        this.cliente = resp;
        this.perfilForm.patchValue({
          nome: resp.nome,
          cpf: resp.cpf,
          dataNascimento: resp.dataNascimento,
          permitirMarketing: resp.permitirMarketing,
        });
        this.loadImagem();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.notification.showError(err?.error?.message || 'Não foi possível carregar o perfil.');
      },
    });
    this.subs.push(sub);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      if (!file.type.match('image.*')) {
        this.notification.showError('Selecione um arquivo de imagem valido.');
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

  uploadImagem(): void {
    if (!this.imagemArquivo) {
      this.notification.showError('Nenhum arquivo selecionado.');
      return;
    }
    this.loading = true;
    const sub = this.service.uploadImagem(this.imagemArquivo).subscribe({
      next: () => {
        this.loading = false;
        this.notification.showSuccess('Imagem atualizada com sucesso.');
        this.loadImagem();
        this.imagemArquivo = null;
      },
      error: (err) => {
        this.loading = false;
        this.notification.showError(err?.error?.message || 'Erro ao enviar imagem.');
      },
    });
    this.subs.push(sub);
  }

  private loadImagem(): void {
    const sub = this.service.getImagem().subscribe({
      next: (blob) => {
        if (this.imagemPreview) {
          URL.revokeObjectURL(this.imagemPreview);
        }
        this.imagemPreview = URL.createObjectURL(blob);
      },
      error: () => {
        this.imagemPreview = null;
      },
    });
    this.subs.push(sub);
  }

  salvarPerfil(): void {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const payload = {
      ...this.perfilForm.value,
      dataNascimento: this.perfilForm.value.dataNascimento,
    };
    const sub = this.service.update(payload).subscribe({
      next: () => {
        this.loading = false;
        this.notification.showSuccess('Dados atualizados.');
      },
      error: (err) => {
        this.loading = false;
        this.notification.showError(err?.error?.message || 'Erro ao atualizar perfil.');
      },
    });
    this.subs.push(sub);
  }

  alterarSenha(): void {
    if (this.senhaForm.invalid) {
      this.senhaForm.markAllAsTouched();
      return;
    }
    const { novaSenha, confirmarSenha } = this.senhaForm.value;
    if (novaSenha !== confirmarSenha) {
      this.notification.showError('As senhas precisam coincidir.');
      return;
    }
    const sub = this.service.alterarSenha(novaSenha).subscribe({
      next: () => {
        this.notification.showSuccess('Senha alterada com sucesso.');
        this.senhaForm.reset();
        this.showSenhaModal = false;
      },
      error: (err) => this.notification.showError(err?.error?.message || 'Erro ao alterar senha.'),
    });
    this.subs.push(sub);
  }

  alterarEmail(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }
    const novoEmail = this.emailForm.value.novoEmail;
    const sub = this.service.alterarEmail(novoEmail).subscribe({
      next: () => {
        this.notification.showSuccess('Email alterado com sucesso.');
        this.showEmailModal = false;
      },
      error: (err) => this.notification.showError(err?.error?.message || 'Erro ao alterar email.'),
    });
    this.subs.push(sub);
  }
}
