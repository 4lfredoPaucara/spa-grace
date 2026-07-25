import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fechaNoPasadaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    const fecha = new Date(value + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fecha >= hoy ? null : { fechaPasada: { message: 'La fecha no puede ser anterior a hoy' } };
  };
}
