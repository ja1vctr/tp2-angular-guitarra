import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { Funcionario } from '../../../model/usuario/funcionario';
import { FuncionarioService } from '../../../service/usuario/funcionario.service';
import { NotificationService } from '../../../service/notification/notification.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit, OnDestroy {
  funcionario?: Funcionario;
  loading = false;
  error: string | null = null;

  imagemPreview: string | null = null;
  imagemArquivo: File | null = null;

  showModal = false;
  senhaForm: FormGroup;

  private subs: Subscription[] = [];

  constructor(
    private funcionarioService: FuncionarioService,
    private notification: NotificationService,
    private fb: FormBuilder
  ) {
    this.senhaForm = this.fb.group({
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.carregarPerfil();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  carregarPerfil(): void {
    this.loading = true;
    const sub = this.funcionarioService.getLogado().subscribe({
      next: (resp) => {
        this.funcionario = resp;
        this.loading = false;
        if (resp?.id) {
          this.loadImagem(resp.id);
        }
      },
      error: (err) => {
        this.error = err?.error?.message || 'Não foi possível carregar o perfil.';
        this.loading = false;
      },
    });
    this.subs.push(sub);
  }

  private loadImagem(id: number): void {
    const sub = this.funcionarioService.getImagem(id).subscribe({
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
    if (!this.funcionario?.id) {
      this.notification.showError('Perfil não carregado.');
      return;
    }
    if (!this.imagemArquivo) {
      this.notification.showError('Nenhum arquivo selecionado.');
      return;
    }
    this.loading = true;
    const sub = this.funcionarioService
      .uploadImagem(this.funcionario.id, this.imagemArquivo)
      .subscribe({
        next: () => {
          this.loading = false;
          this.notification.showSuccess('Imagem enviada com sucesso.');
          this.loadImagem(this.funcionario!.id!);
          this.imagemArquivo = null;
        },
        error: (err) => {
          this.loading = false;
          this.notification.showError(err?.error?.message || 'Erro ao enviar imagem.');
        },
      });
    this.subs.push(sub);
  }

  onDownloadImagem(): void {
    if (!this.imagemPreview) {
      this.notification.showError('Nenhuma imagem para download.');
      return;
    }
    const link = document.createElement('a');
    link.href = this.imagemPreview;
    link.download = `perfil_funcionario.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  abrirModal(): void {
    this.senhaForm.reset();
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
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

    this.loading = true;
    const sub = this.funcionarioService.alterarSenhaLogado(novaSenha).subscribe({
      next: () => {
        this.loading = false;
        this.notification.showSuccess('Senha alterada com sucesso.');
        this.fecharModal();
      },
      error: (err) => {
        this.loading = false;
        this.notification.showError(err?.error?.message || 'Erro ao alterar senha.');
      },
    });
    this.subs.push(sub);
  }
}
