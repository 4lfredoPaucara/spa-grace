import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { ApiResponse } from '../core/interfaces/api-response.interface';

@Injectable({ providedIn: 'any' })
export class ReportsService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/reports`;

  getDashboard(): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${this.url}/dashboard`);
  }

  getSummaryByStatus(): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${this.url}/summary-by-status`);
  }

  getIngresos(params: Record<string, unknown> = {}): Observable<ApiResponse<unknown>> {
    const httpParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') httpParams.set(k, String(v));
    });
    return this.http.get<ApiResponse<unknown>>(`${this.url}/ingresos?${httpParams.toString()}`);
  }

  getIngresosDiarios(fecha: string): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${this.url}/ingresos/diario?fecha=${fecha}`);
  }

  getServiciosPopulares(params: Record<string, unknown> = {}): Observable<ApiResponse<unknown>> {
    const httpParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') httpParams.set(k, String(v));
    });
    return this.http.get<ApiResponse<unknown>>(`${this.url}/servicios-populares?${httpParams.toString()}`);
  }

  getEmpleadosRendimiento(params: Record<string, unknown> = {}): Observable<ApiResponse<unknown>> {
    const httpParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') httpParams.set(k, String(v));
    });
    return this.http.get<ApiResponse<unknown>>(`${this.url}/empleados-rendimiento?${httpParams.toString()}`);
  }

  getClientesFrecuentes(limite = 10): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${this.url}/clientes-frecuentes?limite=${limite}`);
  }

  getOcupacion(fecha: string): Observable<ApiResponse<unknown>> {
    return this.http.get<ApiResponse<unknown>>(`${this.url}/ocupacion?fecha=${fecha}`);
  }
}
