import { Component, inject, signal } from '@angular/core';
import { PromocionesService } from '../../../services/promociones.service';
import { ToastService } from '../../../shared/components/toast-notification/toast.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { PromocionFormComponent } from './promocion-form/promocion-form.component';
import { ReadableDatePipe } from '../../../shared/pipes/readable-date.pipe';
import type { Promocion } from '../../../core/models/promocion.model';

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [ConfirmModalComponent, LoadingSpinnerComponent, EmptyStateComponent, PromocionFormComponent, ReadableDatePipe],
  templateUrl: './promociones.component.html',
})
export class PromocionesComponent {
  private readonly service = inject(PromocionesService);
  private readonly toast = inject(ToastService);
  readonly items = signal<Promocion[]>([]);
  readonly loading = signal(true);
  readonly page = signal(1);
  readonly limit = signal(10);
  readonly total = signal(0);
  readonly showForm = signal(false);
  readonly editing = signal<Promocion | null>(null);
  readonly showConfirm = signal(false);
  readonly deleting = signal<Promocion | null>(null);

  constructor() { this.load(); }
  load(): void {
    this.loading.set(true);
    this.service.findAll({ page: this.page(), limit: this.limit() }).subscribe({
      next: (res) => { this.items.set(res.data); this.total.set(res.meta?.total ?? 0); this.loading.set(false); },
      error: () => { this.loading.set(false); },
    });
  }
  openNew(): void { this.editing.set(null); this.showForm.set(true); }
  openEdit(p: Promocion): void { this.editing.set(p); this.showForm.set(true); }
  onFormClose(): void { this.showForm.set(false); this.editing.set(null); }
  onFormSaved(): void { this.showForm.set(false); this.editing.set(null); this.load(); }
  toggleActivo(p: Promocion): void {
    const req = p.activo ? this.service.desactivar(p.id) : this.service.activar(p.id);
    req.subscribe({
      next: () => { this.toast.show(p.activo ? 'Desactivada' : 'Activada', 'success'); this.load(); },
      error: () => this.toast.show('Error', 'error'),
    });
  }
  confirmDelete(p: Promocion): void { this.deleting.set(p); this.showConfirm.set(true); }
  executeDelete(): void {
    const p = this.deleting(); if (!p) return;
    this.service.delete(p.id).subscribe({ next: () => { this.toast.show('Eliminada', 'success'); this.showConfirm.set(false); this.load(); } });
  }
}
