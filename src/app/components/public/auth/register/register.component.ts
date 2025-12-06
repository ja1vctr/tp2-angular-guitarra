import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../../service/notification/notification.service';
import { AuthService } from '../../../../service/auth/auth.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  loading = false;
  error: string | null = null;

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.form.value.senha !== this.form.value.confirmarSenha) {
      this.form.markAllAsTouched();
      if (this.form.value.senha !== this.form.value.confirmarSenha) {
        this.error = 'As senhas precisam coincidir.';
      }
      return;
    }

    this.loading = true;
    const { nome, email, senha } = this.form.value;

    this.authService.register({ nome: nome!, email: email!, senha: senha! }).subscribe({
      next: () => {
        this.loading = false;
        this.notification.showSuccess('Cadastro realizado com sucesso!');
        this.router.navigate(['/admin/home']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Não foi possível realizar o cadastro.';
      },
    });
  }
}
