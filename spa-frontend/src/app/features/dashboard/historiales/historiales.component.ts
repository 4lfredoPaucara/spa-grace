import { Component, inject, signal } from '@angular/core';
import { HistorialesService } from '../../services/historiales.service';
import { ToastService } from '../../../shared/components/toast-notification/toast.service';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { HistorialFormComponent } from './historial-form/historial-form.component';
import { ReadableDatePipe } from '../../../shared/pipes/readable-date.pipe';
import type { HistorialClinico } from '../../../core/models/historial.model';

@Component({
  selector: 'app-historiales',
  standalone: true,
  imports: [ConfirmModalComponent, LoadingSpinnerComponent, EmptyStateComponent, HistorialFormComponent, ReadableDatePipe],
  templateUrl: './historiales.component.html',
})
export class HistorialesComponent {
  private readonly service = inject(HistorialesService);
  private readonly toast = inject(ToastService);
  readonly items = signal<HistorialClinico[]>([]);
  readonly loading = signal(true);
  readonly page = signal(1);
  readonly limit = signal(10);
  readonly total = signal(0);
  readonly clienteSearch = signal('');
  readonly showForm = signal(false);
  readonly editing = signal<HistorialClinico | null>(null);

  constructor() { this.load(); }
  load(): void {
    this.loading.set(true);
    const params: Record<string, unknown> = { page: this.page(), limit: this.limit() };
    if (this.clienteSearch()) params['clienteId'] = this.clienteSearch();
    this.service.findAll(params).subscribe({
      next: (res) => { this.items.set(res.data); this.total.set(res.meta?.total ?? 0); this.loading.set(false); },
      error: () => { this.loading.set(false); },
    });
  }
  openNew(): void { this.editing.set(null); this.showForm.set(true); }
  openEdit(h: HistorialClinico): void { this.editing.set(h); this.showForm.set(true); }
  onFormClose(): void { this.showForm.set(false); this.editing.set(null); }
  onFormSaved(): void { this.showForm.set(false); this.editing.set(null); this.load(); }
}
