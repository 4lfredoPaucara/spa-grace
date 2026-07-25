import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Servicio, CategoriaServicio } from '../../core/models/servicio.model';
import type { ApiResponse, PaginatedResponse } from '../../core/interfaces/api-response.interface';

@Injectable({ providedIn: 'any' })
export class ServiciosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/servicios`;

  findAll(params: Record<string, unknown> = {}): Observable<PaginatedResponse<Servicio>> {
    const httpParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') httpParams.set(k, String(v));
    });
    return this.http.get<PaginatedResponse<Servicio>>(`${this.url}?${httpParams.toString()}`);
  }

  findById(id: number): Observable<ApiResponse<Servicio>> {
    return this.http.get<ApiResponse<Servicio>>(`${this.url}/${id}`);
  }

  create(data: unknown): Observable<ApiResponse<Servicio>> {
    return this.http.post<ApiResponse<Servicio>>(this.url, data);
  }

  update(id: number, data: Partial<Servicio>): Observable<ApiResponse<Servicio>> {
    return this.http.patch<ApiResponse<Servicio>>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getCategorias(): Observable<ApiResponse<CategoriaServicio[]>> {
    return this.http.get<ApiResponse<CategoriaServicio[]>>(`${this.url}/categorias`);
  }

  getPrincipales(): Observable<ApiResponse<Servicio[]>> {
    return this.http.get<ApiResponse<Servicio[]>>(`${this.url}/principales`);
  }

  getAddons(parentId: number): Observable<ApiResponse<Servicio[]>> {
    return this.http.get<ApiResponse<Servicio[]>>(`${this.url}/addons/${parentId}`);
  }
}
