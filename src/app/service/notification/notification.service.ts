import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showError(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      panelClass: ['snackbar-error'],
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      duration: 5000,
    });
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'OK', {
      panelClass: ['snackbar-success'],
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      duration: 4000,
    });
  }
}
