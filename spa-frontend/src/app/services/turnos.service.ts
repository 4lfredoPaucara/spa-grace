import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Turno } from '../core/models/turno.model';
import type { ApiResponse, PaginatedResponse } from '../core/interfaces/api-response.interface';

@Injectable({ providedIn: 'any' })
export class TurnosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/turnos`;

  findAll(params: Record<string, unknown> = {}): Observable<PaginatedResponse<Turno>> {
    const httpParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') httpParams.set(k, String(v));
    });
    return this.http.get<PaginatedResponse<Turno>>(`${this.url}?${httpParams.toString()}`);
  }

  findById(id: number): Observable<ApiResponse<Turno>> {
    return this.http.get<ApiResponse<Turno>>(`${this.url}/${id}`);
  }

  create(data: unknown): Observable<ApiResponse<Turno>> {
    return this.http.post<ApiResponse<Turno>>(this.url, data);
  }

  update(id: number, data: unknown): Observable<ApiResponse<Turno>> {
    return this.http.patch<ApiResponse<Turno>>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getCalendario(params: Record<string, unknown> = {}): Observable<ApiResponse<Turno[]>> {
    const httpParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') httpParams.set(k, String(v));
    });
    return this.http.get<ApiResponse<Turno[]>>(`${this.url}/calendario?${httpParams.toString()}`);
  }

  confirmar(id: number): Observable<ApiResponse<Turno>> {
    return this.http.patch<ApiResponse<Turno>>(`${this.url}/${id}/confirmar`, {});
  }

  atender(id: number): Observable<ApiResponse<Turno>> {
    return this.http.patch<ApiResponse<Turno>>(`${this.url}/${id}/atender`, {});
  }

  reprogramar(id: number, data: { fecha: string; hora: string }): Observable<ApiResponse<Turno>> {
    return this.http.patch<ApiResponse<Turno>>(`${this.url}/${id}/reprogramar`, data);
  }
}
