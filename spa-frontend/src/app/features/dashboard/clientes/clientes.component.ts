import { Component, inject, signal } from '@angular/core';
import { ClientesService } from '../../services/clientes.service';
import { ToastService } from '../../../shared/components/toast-notification/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SearchInputComponent } from '../../../shared/components/search-input/search-input.component';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { PhonePipe } from '../../../shared/pipes/phone.pipe';
import type { Cliente } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [LoadingSpinnerComponent, EmptyStateComponent, SearchInputComponent, ClienteFormComponent, PhonePipe],
  templateUrl: './clientes.component.html',
})
export class ClientesComponent {
  private readonly clientesService = inject(ClientesService);
  private readonly toast = inject(ToastService);
  readonly clientes = signal<Cliente[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly search = signal('');
  readonly page = signal(1);
  readonly limit = signal(10);
  readonly total = signal(0);
  readonly showForm = signal(false);
  readonly editingCliente = signal<Cliente | null>(null);

  constructor() { this.load(); }
  load(): void {
    this.loading.set(true);
    this.clientesService.findAll({ page: this.page(), limit: this.limit(), search: this.search() }).subscribe({
      next: (res) => { this.clientes.set(res.data); this.total.set(res.meta?.total ?? 0); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar'); this.loading.set(false); },
    });
  }
  openNew(): void { this.editingCliente.set(null); this.showForm.set(true); }
  openEdit(c: Cliente): void { this.editingCliente.set(c); this.showForm.set(true); }
  onFormClose(): void { this.showForm.set(false); this.editingCliente.set(null); }
  onFormSaved(): void { this.showForm.set(false); this.editingCliente.set(null); this.load(); }
}
