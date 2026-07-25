import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Promocion } from '../core/models/promocion.model';
import type { ApiResponse, PaginatedResponse } from '../core/interfaces/api-response.interface';

@Injectable({ providedIn: 'any' })
export class PromocionesService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/promociones`;

  findAll(params: Record<string, unknown> = {}): Observable<PaginatedResponse<Promocion>> {
    const httpParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') httpParams.set(k, String(v));
    });
    return this.http.get<PaginatedResponse<Promocion>>(`${this.url}?${httpParams.toString()}`);
  }

  findById(id: number): Observable<ApiResponse<Promocion>> {
    return this.http.get<ApiResponse<Promocion>>(`${this.url}/${id}`);
  }

  create(data: unknown): Observable<ApiResponse<Promocion>> {
    return this.http.post<ApiResponse<Promocion>>(this.url, data);
  }

  update(id: number, data: Partial<Promocion>): Observable<ApiResponse<Promocion>> {
    return this.http.patch<ApiResponse<Promocion>>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  activar(id: number): Observable<ApiResponse<Promocion>> {
    return this.http.post<ApiResponse<Promocion>>(`${this.url}/${id}/activar`, {});
  }

  desactivar(id: number): Observable<ApiResponse<Promocion>> {
    return this.http.post<ApiResponse<Promocion>>(`${this.url}/${id}/desactivar`, {});
  }

  validar(codigo: string, servicioId?: number): Observable<ApiResponse<unknown>> {
    let url = `${this.url}/validar?codigo=${codigo}`;
    if (servicioId) url += `&servicioId=${servicioId}`;
    return this.http.get<ApiResponse<unknown>>(url);
  }
}
