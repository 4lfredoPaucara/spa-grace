import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type { User } from '../../../core/models/user.model';
import type { LoginRequest } from '../../../core/interfaces/api-response.interface';

interface LoginApiResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly currentUserSignal = signal<User | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly userRole = computed(() => this.currentUserSignal()?.rol ?? null);

  constructor() {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<LoginApiResponse> {
    return this.http.post<LoginApiResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        this.currentUserSignal.set(res.data.user);
      })
    );
  }

  register(data: { nombre: string; email: string; username: string; password: string; telefono?: string }): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  refreshToken(): Observable<{ data: { accessToken: string; refreshToken: string } }> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<{ data: { accessToken: string; refreshToken: string } }>(
      `${this.apiUrl}/refresh`,
      { refreshToken }
    );
  }

  getProfile(): Observable<{ success: boolean; data: User }> {
    return this.http.get<{ success: boolean; data: User }>(`${this.apiUrl}/profile`);
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/change-password`, data);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        this.currentUserSignal.set(JSON.parse(userStr));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }
}
