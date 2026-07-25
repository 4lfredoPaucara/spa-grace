import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    const hasMinLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const valid = hasMinLength && hasUpperCase && hasNumber;
    return valid ? null : { passwordStrength: { message: 'Mínimo 8 caracteres, una mayúscula y un número' } };
  };
}
