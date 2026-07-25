import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/components/toast-notification/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        toast.show('Error de conexión con el servidor', 'error');
      } else if (error.status === 400) {
        toast.show(error.error?.message || 'Datos inválidos', 'error');
      } else if (error.status === 401) {
        toast.show('Sesión expirada. Iniciá sesión nuevamente.', 'error');
        localStorage.clear();
        router.navigate(['/login']);
      } else if (error.status === 403) {
        toast.show('No tenés permisos para esta acción', 'error');
      } else if (error.status === 404) {
        toast.show('Recurso no encontrado', 'error');
      } else if (error.status === 409) {
        toast.show(error.error?.message || 'Conflicto de datos', 'error');
      } else if (error.status >= 500) {
        toast.show('Error interno del servidor', 'error');
      }
      return throwError(() => error);
    })
  );
};
