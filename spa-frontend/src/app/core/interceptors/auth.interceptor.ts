import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const http = inject(HttpClient);

  const token = localStorage.getItem('accessToken');

  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            isRefreshing = false;
            localStorage.clear();
            router.navigate(['/login']);
            return throwError(() => error);
          }

          return http.post<{ data: { accessToken: string; refreshToken: string } }>(
            'http://localhost:3000/api/v1/auth/refresh',
            { refreshToken }
          ).pipe(
            switchMap((response) => {
              isRefreshing = false;
              localStorage.setItem('accessToken', response.data.accessToken);
              localStorage.setItem('refreshToken', response.data.refreshToken);
              refreshTokenSubject.next(response.data.accessToken);
              return next(
                req.clone({
                  setHeaders: { Authorization: `Bearer ${response.data.accessToken}` },
                })
              );
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              localStorage.clear();
              router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((newToken) =>
              next(
                req.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` },
                })
              )
            )
          );
        }
      }
      return throwError(() => error);
    })
  );
};
