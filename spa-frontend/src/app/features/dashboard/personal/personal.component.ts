import { Component, inject, signal } from '@angular/core';
import { EmpleadosService } from '../../services/empleados.service';
import { ToastService } from '../../../shared/components/toast-notification/toast.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { EmpleadoFormComponent } from './empleado-form/empleado-form.component';
import type { Empleado } from '../../../core/models/empleado.model';

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [ConfirmModalComponent, LoadingSpinnerComponent, EmptyStateComponent, SearchInputComponent, EmpleadoFormComponent],
  templateUrl: './personal.component.html',
})
export class PersonalComponent {
  private readonly empleadosService = inject(EmpleadosService);
  private readonly toast = inject(ToastService);

  readonly empleados = signal<Empleado[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly search = signal('');
  readonly page = signal(1);
  readonly limit = signal(10);
  readonly total = signal(0);

  readonly showForm = signal(false);
  readonly editingEmpleado = signal<Empleado | null>(null);
  readonly showConfirm = signal(false);
  readonly deletingEmpleado = signal<Empleado | null>(null);

  constructor() { this.load(); }

  load(): void {
    this.loading.set(true);
    this.empleadosService.findAll({ page: this.page(), limit: this.limit(), search: this.search() }).subscribe({
      next: (res) => { this.empleados.set(res.data); this.total.set(res.meta?.total ?? 0); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar'); this.loading.set(false); },
    });
  }

  openNew(): void { this.editingEmpleado.set(null); this.showForm.set(true); }
  openEdit(e: Empleado): void { this.editingEmpleado.set(e); this.showForm.set(true); }
  onFormClose(): void { this.showForm.set(false); this.editingEmpleado.set(null); }
  onFormSaved(): void { this.showForm.set(false); this.editingEmpleado.set(null); this.load(); }

  confirmDelete(e: Empleado): void { this.deletingEmpleado.set(e); this.showConfirm.set(true); }
  executeDelete(): void {
    const e = this.deletingEmpleado();
    if (!e) return;
    this.empleadosService.delete(e.id).subscribe({
      next: () => { this.toast.show('Empleado eliminado', 'success'); this.showConfirm.set(false); this.load(); },
      error: () => this.toast.show('Error al eliminar', 'error'),
    });
  }
}
