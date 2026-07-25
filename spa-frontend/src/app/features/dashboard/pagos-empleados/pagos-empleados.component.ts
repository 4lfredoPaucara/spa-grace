import { Component, inject, signal } from '@angular/core';
import { PagosEmpleadosService } from '../../services/pagos-empleados.service';
import { EmpleadosService } from '../../services/empleados.service';
import { ToastService } from '../../../shared/components/toast-notification/toast.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PagoEmpleadoFormComponent } from './pago-empleado-form/pago-empleado-form.component';
import { CurrencyArsPipe } from '../../../shared/pipes/currency.pipe';
import { ReadableDatePipe } from '../../../shared/pipes/readable-date.pipe';
import type { PagoEmpleado } from '../../../core/models/pago-empleado.model';
import type { Empleado } from '../../../core/models/empleado.model';

@Component({
  selector: 'app-pagos-empleados',
  standalone: true,
  imports: [
    ConfirmModalComponent, LoadingSpinnerComponent, EmptyStateComponent,
    PagoEmpleadoFormComponent, CurrencyArsPipe, ReadableDatePipe,
  ],
  templateUrl: './pagos-empleados.component.html',
})
export class PagosEmpleadosComponent {
  private readonly service = inject(PagosEmpleadosService);
  private readonly empleadosService = inject(EmpleadosService);
  private readonly toast = inject(ToastService);

  readonly items = signal<PagoEmpleado[]>([]);
  readonly empleados = signal<Empleado[]>([]);
  readonly loading = signal(true);
  readonly page = signal(1);
  readonly limit = signal(10);
  readonly total = signal(0);
  readonly filterEmpleado = signal<number | null>(null);
  readonly showForm = signal(false);
  readonly editing = signal<PagoEmpleado | null>(null);
  readonly showConfirm = signal(false);
  readonly deleting = signal<PagoEmpleado | null>(null);

  constructor() {
    this.load();
    this.empleadosService.findAll({ limit: 100 }).subscribe((res) => this.empleados.set(res.data));
  }

  load(): void {
    this.loading.set(true);
    const params: Record<string, unknown> = { page: this.page(), limit: this.limit() };
    if (this.filterEmpleado()) params['empleadoId'] = this.filterEmpleado();
    this.service.findAll(params).subscribe({
      next: (res) => {
        this.items.set(res.data);
        this.total.set(res.meta?.total ?? 0);
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); },
    });
  }

  openNew(): void { this.editing.set(null); this.showForm.set(true); }
  openEdit(p: PagoEmpleado): void { this.editing.set(p); this.showForm.set(true); }
  onFormClose(): void { this.showForm.set(false); this.editing.set(null); }
  onFormSaved(): void { this.showForm.set(false); this.editing.set(null); this.load(); }

  confirmDelete(p: PagoEmpleado): void { this.deleting.set(p); this.showConfirm.set(true); }

  executeDelete(): void {
    const p = this.deleting();
    if (!p) return;
    this.service.delete(p.id).subscribe({
      next: () => {
        this.toast.show('Eliminado', 'success');
        this.showConfirm.set(false);
        this.load();
      },
    });
  }
}
