import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../service/notification/notification.service';
import { ServerError } from '../../model/error/server-error.model';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifier = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.error) {
        const serverError = error.error as ServerError;

        // 🔹 Prioridade 1: erros de campo (validação)
        if (serverError.errors && serverError.errors.length > 0) {
          serverError.errors.forEach(fieldError => {
            notifier.showError(`${fieldError.message}`);
          });
        }

        // 🔹 Prioridade 2: mensagem de detalhe geral
        else if (serverError.detail) {
          notifier.showError(serverError.detail);
        }

        // 🔹 Prioridade 3: título genérico
        else if (serverError.title) {
          notifier.showError(serverError.title);
        }

        else {
          notifier.showError('Ocorreu um erro inesperado.');
        }
      } else {
        notifier.showError('Falha na comunicação com o servidor.');
      }

      return throwError(() => error);
    })
  );
};
