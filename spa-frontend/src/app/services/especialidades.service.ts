import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { ApiResponse } from '../core/interfaces/api-response.interface';

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}

@Injectable({ providedIn: 'root' })
export class EspecialidadesService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/especialidades`;

  findAll(): Observable<ApiResponse<Especialidad[]>> {
    return this.http.get<ApiResponse<Especialidad[]>>(this.url);
  }

  create(data: { nombre: string; descripcion?: string }): Observable<ApiResponse<Especialidad>> {
    return this.http.post<ApiResponse<Especialidad>>(this.url, data);
  }

  update(id: number, data: Partial<Especialidad>): Observable<ApiResponse<Especialidad>> {
    return this.http.patch<ApiResponse<Especialidad>>(`${this.url}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
