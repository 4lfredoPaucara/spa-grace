import { Component, inject, signal, computed } from '@angular/core';
import { ServiciosService } from '../../../services/servicios.service';
import { ToastService } from '../../../shared/components/toast-notification/toast.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { CurrencyArsPipe } from '../../../shared/pipes/currency.pipe';
import { ServicioFormComponent } from './servicio-form/servicio-form.component';
import type { Servicio } from '../../../core/models/servicio.model';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [ConfirmModalComponent, LoadingSpinnerComponent, EmptyStateComponent, SearchInputComponent, CurrencyArsPipe, ServicioFormComponent],
  templateUrl: './servicios.component.html',
})
export class ServiciosComponent {
  private readonly serviciosService = inject(ServiciosService);
  private readonly toast = inject(ToastService);

  readonly servicios = signal<Servicio[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly search = signal('');
  readonly tipoFilter = signal<string>('');
  readonly page = signal(1);
  readonly limit = signal(10);
  readonly total = signal(0);

  readonly showForm = signal(false);
  readonly editingServicio = signal<Servicio | null>(null);
  readonly showConfirm = signal(false);
  readonly deletingServicio = signal<Servicio | null>(null);

  constructor() { this.loadServicios(); }

  loadServicios(): void {
    this.loading.set(true);
    const params: Record<string, unknown> = { page: this.page(), limit: this.limit(), search: this.search() };
    if (this.tipoFilter()) params['tipo'] = this.tipoFilter();
    this.serviciosService.findAll(params).subscribe({
      next: (res) => { this.servicios.set(res.data); this.total.set(res.meta?.total ?? 0); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar servicios'); this.loading.set(false); },
    });
  }

  openNew(): void { this.editingServicio.set(null); this.showForm.set(true); }
  openEdit(s: Servicio): void { this.editingServicio.set(s); this.showForm.set(true); }

  onFormClose(): void { this.showForm.set(false); this.editingServicio.set(null); }
  onFormSaved(): void { this.showForm.set(false); this.editingServicio.set(null); this.loadServicios(); }

  confirmDelete(s: Servicio): void { this.deletingServicio.set(s); this.showConfirm.set(true); }
  executeDelete(): void {
    const s = this.deletingServicio();
    if (!s) return;
    this.serviciosService.delete(s.id).subscribe({
      next: () => { this.toast.show('Servicio eliminado', 'success'); this.showConfirm.set(false); this.loadServicios(); },
      error: () => this.toast.show('Error al eliminar', 'error'),
    });
  }
}
