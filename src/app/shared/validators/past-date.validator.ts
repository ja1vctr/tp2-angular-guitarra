import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function notFutureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // não valida se estiver vazio (deixa o required cuidar disso)
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // zera hora pra comparar só data

    const inputDate = new Date(value);
    inputDate.setHours(0, 0, 0, 0);

    // se a data for depois de hoje, inválida
    return inputDate > today ? { futureDate: true } : null;
  };
} 