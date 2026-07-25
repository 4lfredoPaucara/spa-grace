import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { HistorialClinico } from '../../core/models/historial.model';
import type { ApiResponse, PaginatedResponse } from '../../core/interfaces/api-response.interface';

@Injectable({ providedIn: 'any' })
export class HistorialesService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/historiales`;

  findAll(params: Record<string, unknown> = {}): Observable<PaginatedResponse<HistorialClinico>> {
    const httpParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') httpParams.set(k, String(v));
    });
    return this.http.get<PaginatedResponse<HistorialClinico>>(`${this.url}?${httpParams.toString()}`);
  }

  findById(id: number): Observable<ApiResponse<HistorialClinico>> {
    return this.http.get<ApiResponse<HistorialClinico>>(`${this.url}/${id}`);
  }

  create(data: unknown): Observable<ApiResponse<HistorialClinico>> {
    return this.http.post<ApiResponse<HistorialClinico>>(this.url, data);
  }

  update(id: number, data: Partial<HistorialClinico>): Observable<ApiResponse<HistorialClinico>> {
    return this.http.patch<ApiResponse<HistorialClinico>>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  upload(id: number, file: File): Observable<ApiResponse<HistorialClinico>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<HistorialClinico>>(`${this.url}/${id}/upload`, formData);
  }
}
