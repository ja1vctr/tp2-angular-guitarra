import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServerError, ServerFieldError } from '../../model/error/server-error.model';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  constructor(private snack: MatSnackBar) {}

  showMessage(message: string, action = 'OK', duration = 5000) {
    this.snack.open(message, action, { duration });
  }

  /**
   * Aplica erros vindos do backend (lista de {field, message}) a um FormGroup.
   * Retorna true se aplicou algum erro de campo.
   */
  applyFieldErrorsToForm(form: FormGroup, fieldErrors?: ServerFieldError[]): boolean {
    if (!fieldErrors || fieldErrors.length === 0) return false;

    let applied = false;
    for (const e of fieldErrors) {
      const control = form.get(e.field);
      if (control) {
        // marca erro específico no controle
        control.setErrors({ server: e.message });
        applied = true;
      }
    }
    // opcional: marcar formulário como tocado para mostrar mensagens
    form.markAllAsTouched();
    return applied;
  }

  /**
   * Tratamento geral: se houver detail, exibe snackbar; se houver errors[] e um form for passado, aplica no form.
   */
  handleServerError(error: ServerError, form?: FormGroup) {
    if (form && error.errors && error.errors.length) {
      const ok = this.applyFieldErrorsToForm(form, error.errors);
      if (ok) return;
    }
    // se não aplicou erros de campo, exibe detail ou title
    const message = error.detail || error.title || 'Erro inesperado';
    this.showMessage(message);
  }
}
