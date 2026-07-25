import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

let totalRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  totalRequests++;
  return next(req).pipe(
    finalize(() => {
      totalRequests--;
    })
  );
};
