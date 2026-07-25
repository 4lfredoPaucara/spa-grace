import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Empleado } from '../../core/models/empleado.model';
import type { Turno } from '../../core/models/turno.model';
import type { Disponibilidad } from '../../core/models/disponibilidad.model';
import type { ApiResponse, PaginatedResponse } from '../../core/interfaces/api-response.interface';

@Injectable({ providedIn: 'any' })
export class EmpleadosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/empleados`;

  findAll(params: Record<string, unknown> = {}): Observable<PaginatedResponse<Empleado>> {
    const httpParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') httpParams.set(k, String(v));
    });
    return this.http.get<PaginatedResponse<Empleado>>(`${this.url}?${httpParams.toString()}`);
  }

  findById(id: number): Observable<ApiResponse<Empleado>> {
    return this.http.get<ApiResponse<Empleado>>(`${this.url}/${id}`);
  }

  create(data: unknown): Observable<ApiResponse<Empleado>> {
    return this.http.post<ApiResponse<Empleado>>(this.url, data);
  }

  update(id: number, data: Partial<Empleado>): Observable<ApiResponse<Empleado>> {
    return this.http.patch<ApiResponse<Empleado>>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  assignServicio(id: number, servicioId: number): Observable<ApiResponse<Empleado>> {
    return this.http.post<ApiResponse<Empleado>>(`${this.url}/${id}/servicios`, { id_servicio: servicioId });
  }

  removeServicio(id: number, servicioId: number): Observable<ApiResponse<Empleado>> {
    return this.http.delete<ApiResponse<Empleado>>(`${this.url}/${id}/servicios/${servicioId}`);
  }

  getDisponibilidad(id: number): Observable<ApiResponse<Disponibilidad[]>> {
    return this.http.get<ApiResponse<Disponibilidad[]>>(`${this.url}/${id}/disponibilidad`);
  }

  getTurnos(id: number, params: Record<string, unknown> = {}): Observable<PaginatedResponse<Turno>> {
    const httpParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') httpParams.set(k, String(v));
    });
    return this.http.get<PaginatedResponse<Turno>>(`${this.url}/${id}/turnos?${httpParams.toString()}`);
  }

  getDisponibles(params: Record<string, unknown> = {}): Observable<ApiResponse<unknown[]>> {
    const httpParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') httpParams.set(k, String(v));
    });
    return this.http.get<ApiResponse<unknown[]>>(`${this.url}/disponibles?${httpParams.toString()}`);
  }
}
