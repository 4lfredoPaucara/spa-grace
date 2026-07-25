import { Component, inject, output, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ClientesService } from '../../../services/clientes.service';
import { EmpleadosService } from '../../../services/empleados.service';
import { ServiciosService } from '../../../services/servicios.service';
import { TurnosService } from '../../../services/turnos.service';
import { ToastService } from '../../../../shared/'components/toast-notification/toast.service';
import { CurrencyArsPipe } from '../../../../shared/'pipes/currency.pipe';
import type { Servicio } from '../../../../core/'models/servicio.model';

@Component({
  selector: 'app-turno-form',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyArsPipe],
  templateUrl: './turno-form.component.html',
})
export class TurnoFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly clientesService = inject(ClientesService);
  private readonly empleadosService = inject(EmpleadosService);
  private readonly serviciosService = inject(ServiciosService);
  private readonly turnosService = inject(TurnosService);
  private readonly toast = inject(ToastService);

  readonly close = output<void>();
  readonly saved = output<void>();

  readonly isSubmitting = signal(false);

  // Dynamic selects
  readonly clientes = signal<any[]>([]);
  readonly empleados = signal<any[]>([]);
  readonly serviciosPrincipales = signal<Servicio[]>([]);
  readonly addonsDisponibles = signal<Servicio[]>([]);
  readonly searchingClientes = signal(false);
  readonly searchingServicios = signal(false);
  readonly loadingEmpleados = signal(false);

  // Selected services
  readonly selectedServicios = signal<Servicio[]>([]);

  readonly form = this.fb.nonNullable.group({
    idCliente: [0, [Validators.required, Validators.min(1)]],
    idEmpleado: [0, [Validators.required, Validators.min(1)]],
    fecha: ['', [Validators.required]],
    hora: ['', [Validators.required]],
    notasTurno: [''],
  });

  readonly precioTotal = computed(() =>
    this.selectedServicios().reduce((sum, s) => sum + (s.precio ?? 0), 0)
  );

  readonly duracionTotal = computed(() =>
    this.selectedServicios().reduce((sum, s) => sum + (s.duracion ?? 0), 0)
  );

  constructor() {
    this.cargarServiciosPrincipales();
  }

  get tomorrow(): string {
    const d = new Date();
    d.setDate(d.getDate());
    return d.toISOString().split('T')[0];
  }

  searchClientes(query: string): void {
    if (query.length < 2) { this.clientes.set([]); return; }
    this.searchingClientes.set(true);
    this.clientesService.findAll({ search: query, limit: 10 }).subscribe({
      next: (res) => { this.clientes.set(res.data); this.searchingClientes.set(false); },
      error: () => { this.searchingClientes.set(false); },
    });
  }

  searchServicios(query: string): void {
    if (query.length < 1) { this.serviciosPrincipales.set([]); return; }
    this.searchingServicios.set(true);
    this.serviciosService.findAll({ search: query, activo: true, tipo: 'principal', limit: 15 }).subscribe({
      next: (res) => { this.serviciosPrincipales.set(res.data); this.searchingServicios.set(false); },
      error: () => { this.searchingServicios.set(false); },
    });
  }

  onEmpleadoChange(): void {
    const empleadoId = this.form.get('idEmpleado')?.value;
    if (!empleadoId) return;
    this.loadingEmpleados.set(true);
    const fecha = this.form.get('fecha')?.value;
    const hora = this.form.get('hora')?.value;
    this.empleadosService.getDisponibles({ fecha, hora, empleadoId }).subscribe({
      next: (res) => { this.empleados.set(res.data as any[]); this.loadingEmpleados.set(false); },
      error: () => { this.loadingEmpleados.set(false); },
    });
  }

  cargarServiciosPrincipales(): void {
    this.serviciosService.getPrincipales().subscribe({
      next: (res) => { this.serviciosPrincipales.set(res.data); },
    });
  }

  addServicio(servicio: Servicio): void {
    if (this.selectedServicios().find((s) => s.id === servicio.id)) return;
    if (servicio.tipo === 'addon') {
      const parentId = servicio.parentServicioId;
      if (parentId && !this.selectedServicios().find((s) => s.id === parentId)) {
        this.toast.show('Primero debés agregar el servicio principal', 'warning');
        return;
      }
    }
    this.selectedServicios.update((arr) => [...arr, servicio]);
    if (servicio.tipo === 'principal') {
      this.serviciosService.getAddons(servicio.id).subscribe({
        next: (res) => { this.addonsDisponibles.update((a) => [...a, ...res.data]); },
      });
    }
  }

  removeServicio(servicioId: number): void {
    const s = this.selectedServicios().find((x) => x.id === servicioId);
    this.selectedServicios.update((arr) => arr.filter((x) => x.id !== servicioId));
    if (s?.tipo === 'principal') {
      this.addonsDisponibles.update((arr) => arr.filter((x) => x.parentServicioId !== servicioId));
      this.selectedServicios.update((arr) => arr.filter((x) => x.parentServicioId !== servicioId));
    }
  }

  onSubmit(): void {
    if (this.form.invalid || this.selectedServicios().length === 0) {
      this.toast.show('Completá todos los campos y seleccioná al menos un servicio', 'warning');
      return;
    }
    this.isSubmitting.set(true);
    const formData = this.form.getRawValue();
    const payload = {
      idCliente: formData.idCliente,
      idEmpleado: formData.idEmpleado,
      serviciosIds: this.selectedServicios().map((s) => s.id),
      fecha: formData.fecha,
      hora: formData.hora,
      notasTurno: formData.notasTurno || undefined,
    };
    this.turnosService.create(payload).subscribe({
      next: () => { this.isSubmitting.set(false); this.saved.emit(); },
      error: (err) => {
        this.isSubmitting.set(false);
        this.toast.show(err.error?.message || 'Error al crear el turno', 'error');
      },
    });
  }
}
