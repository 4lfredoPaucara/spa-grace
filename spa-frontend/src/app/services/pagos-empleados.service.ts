import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { PagoEmpleado } from '../core/models/pago-empleado.model';
import type { ApiResponse, PaginatedResponse } from '../core/interfaces/api-response.interface';

@Injectable({ providedIn: 'any' })
export class PagosEmpleadosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/pagos-empleados`;

  findAll(params: Record<string, unknown> = {}): Observable<PaginatedResponse<PagoEmpleado>> {
    const httpParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') httpParams.set(k, String(v));
    });
    return this.http.get<PaginatedResponse<PagoEmpleado>>(`${this.url}?${httpParams.toString()}`);
  }

  findById(id: number): Observable<ApiResponse<PagoEmpleado>> {
    return this.http.get<ApiResponse<PagoEmpleado>>(`${this.url}/${id}`);
  }

  create(data: unknown): Observable<ApiResponse<PagoEmpleado>> {
    return this.http.post<ApiResponse<PagoEmpleado>>(this.url, data);
  }

  update(id: number, data: Partial<PagoEmpleado>): Observable<ApiResponse<PagoEmpleado>> {
    return this.http.patch<ApiResponse<PagoEmpleado>>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
