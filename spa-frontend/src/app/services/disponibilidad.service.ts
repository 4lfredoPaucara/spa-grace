import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Disponibilidad } from '../core/models/disponibilidad.model';
import type { ApiResponse } from '../core/interfaces/api-response.interface';

@Injectable({ providedIn: 'any' })
export class DisponibilidadService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/disponibilidad`;

  findAll(empleadoId?: number): Observable<ApiResponse<Disponibilidad[]>> {
    const qs = empleadoId ? `?empleadoId=${empleadoId}` : '';
    return this.http.get<ApiResponse<Disponibilidad[]>>(`${this.url}${qs}`);
  }

  create(data: unknown): Observable<ApiResponse<Disponibilidad>> {
    return this.http.post<ApiResponse<Disponibilidad>>(this.url, data);
  }

  update(id: number, data: Partial<Disponibilidad>): Observable<ApiResponse<Disponibilidad>> {
    return this.http.patch<ApiResponse<Disponibilidad>>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  createLote(data: unknown): Observable<ApiResponse<Disponibilidad[]>> {
    return this.http.post<ApiResponse<Disponibilidad[]>>(`${this.url}/lote`, data);
  }
}
