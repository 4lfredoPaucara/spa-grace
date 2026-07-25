import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Cobro } from '../../core/models/cobro.model';
import type { ApiResponse, PaginatedResponse } from '../../core/interfaces/api-response.interface';

@Injectable({ providedIn: 'any' })
export class CobrosService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/cobros`;

  findAll(params: Record<string, unknown> = {}): Observable<PaginatedResponse<Cobro>> {
    const httpParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== '') httpParams.set(k, String(v));
    });
    return this.http.get<PaginatedResponse<Cobro>>(`${this.url}?${httpParams.toString()}`);
  }

  findById(id: number): Observable<ApiResponse<Cobro>> {
    return this.http.get<ApiResponse<Cobro>>(`${this.url}/${id}`);
  }

  update(id: number, data: unknown): Observable<ApiResponse<Cobro>> {
    return this.http.patch<ApiResponse<Cobro>>(`${this.url}/${id}`, data);
  }

  aplicarDescuento(id: number, codigoDescuento: string): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.url}/${id}/aplicar-descuento`, { codigoDescuento });
  }

  registrarAdelanto(id: number, data: { montoAdelanto: number; metodoPagoAdelanto: string; notas?: string }): Observable<ApiResponse<Cobro>> {
    return this.http.post<ApiResponse<Cobro>>(`${this.url}/${id}/registrar-adelanto`, data);
  }

  registrarPagoFinal(id: number, data: { metodoPagoFinal: string; notas?: string }): Observable<ApiResponse<Cobro>> {
    return this.http.post<ApiResponse<Cobro>>(`${this.url}/${id}/registrar-pago-final`, data);
  }

  reembolsar(id: number): Observable<ApiResponse<Cobro>> {
    return this.http.post<ApiResponse<Cobro>>(`${this.url}/${id}/reembolsar`, {});
  }
}
