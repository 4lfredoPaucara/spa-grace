import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DisponibilidadService } from '../../services/disponibilidad.service';
import { EmpleadosService } from '../../services/empleados.service';
import { ToastService } from '../../../shared/components/toast-notification/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { DIAS_SEMANA_LABELS, type DiaSemana } from '../../../core/enums/dia-semana.enum';
import type { Empleado } from '../../../core/models/empleado.model';
import type { Disponibilidad } from '../../../core/models/disponibilidad.model';

const DIAS: DiaSemana[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

@Component({
  selector: 'app-disponibilidad',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './disponibilidad.component.html',
})
export class DisponibilidadComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(DisponibilidadService);
  private readonly empleadosService = inject(EmpleadosService);
  private readonly toast = inject(ToastService);

  readonly empleados = signal<Empleado[]>([]);
  readonly selectedEmpleado = signal<number | null>(null);
  readonly disponibilidades = signal<Disponibilidad[]>([]);
  readonly loading = signal(false);
  readonly showForm = signal(false);

  readonly form = this.fb.nonNullable.group({
    diaSemana: ['lunes' as string, Validators.required],
    horaInicio: ['09:00', Validators.required],
    horaFin: ['18:00', Validators.required],
  });

  constructor() { this.loadEmpleados(); }

  loadEmpleados(): void {
    this.empleadosService.findAll({ limit: 100, activo: true }).subscribe({
      next: (res) => this.empleados.set(res.data),
    });
  }

  loadDisponibilidad(id: number): void {
    this.selectedEmpleado.set(id);
    this.loading.set(true);
    this.service.findAll(id).subscribe({
      next: (res) => { this.disponibilidades.set(res.data); this.loading.set(false); },
      error: () => { this.loading.set(false); },
    });
  }

  addBloque(): void {
    const empId = this.selectedEmpleado();
    if (!empId) { this.toast.show('Selecciona un empleado', 'warning'); return; }
    const data = this.form.getRawValue();
    this.service.create({
      idEmpleado: empId,
      diaSemana: data.diaSemana,
      horaInicio: data.horaInicio,
      horaFin: data.horaFin,
      activo: true,
    }).subscribe({
      next: () => { this.toast.show('Bloque agregado', 'success'); this.loadDisponibilidad(empId); this.showForm.set(false); },
      error: (err) => this.toast.show(err.error?.message || 'Error', 'error'),
    });
  }

  deleteBloque(id: number): void {
    const empId = this.selectedEmpleado();
    if (!empId) return;
    this.service.delete(id).subscribe({
      next: () => { this.toast.show('Bloque eliminado', 'success'); this.loadDisponibilidad(empId); },
      error: () => this.toast.show('Error', 'error'),
    });
  }

  getDiaLabel(dia: DiaSemana): string { return DIAS_SEMANA_LABELS[dia]; }

  getBloquesPorDia(dia: DiaSemana): Disponibilidad[] {
    return this.disponibilidades().filter((d) => d.diaSemana === dia);
  }
}
