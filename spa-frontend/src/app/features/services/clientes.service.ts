import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Cliente } from '../../core/models/cliente.model';
import type { Turno } from '../../core/models/turno.model';
import type { HistorialClinico } from '../../core/models/historial.model';
import type { ApiResponse, PaginatedResponse } from '../../core/interfaces/api-response.interface';

@Injectable({ providedIn: 'any' })
export class ClientesService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/clientes`;

  findAll(params: Record<string, unknown> = {}): Observable<PaginatedResponse<Cliente>> {
    const httpParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') httpParams.set(k, String(v));
    });
    return this.http.get<PaginatedResponse<Cliente>>(`${this.url}?${httpParams.toString()}`);
  }

  findById(id: number): Observable<ApiResponse<Cliente>> {
    return this.http.get<ApiResponse<Cliente>>(`${this.url}/${id}`);
  }

  create(data: unknown): Observable<ApiResponse<Cliente>> {
    return this.http.post<ApiResponse<Cliente>>(this.url, data);
  }

  update(id: number, data: Partial<Cliente>): Observable<ApiResponse<Cliente>> {
    return this.http.patch<ApiResponse<Cliente>>(`${this.url}/${id}`, data);
  }

  getHistorial(id: number, params: Record<string, unknown> = {}): Observable<PaginatedResponse<HistorialClinico>> {
    const httpParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') httpParams.set(k, String(v));
    });
    return this.http.get<PaginatedResponse<HistorialClinico>>(`${this.url}/${id}/historial?${httpParams.toString()}`);
  }

  getTurnos(id: number, params: Record<string, unknown> = {}): Observable<PaginatedResponse<Turno>> {
    const httpParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') httpParams.set(k, String(v));
    });
    return this.http.get<PaginatedResponse<Turno>>(`${this.url}/${id}/turnos?${httpParams.toString()}`);
  }
}
