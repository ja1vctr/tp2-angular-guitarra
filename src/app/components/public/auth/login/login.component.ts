import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../../service/notification/notification.service';
import { AuthService } from '../../../../service/auth/auth.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loading = false;
  error: string | null = null;
  form!: FormGroup;

  private returnUrl = '/admin/home';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService
  ) {
    const queryReturn = this.route.snapshot.queryParamMap.get('returnUrl');
    if (queryReturn) {
      this.returnUrl = queryReturn;
    }
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, senha } = this.form.value;

    this.authService.login(email!, senha!).subscribe({
      next: () => {
        this.loading = false;
        this.notification.showSuccess('Login realizado com sucesso!');
        this.router.navigate([this.returnUrl]);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Não foi possível autenticar.';
      },
    });
  }
}
