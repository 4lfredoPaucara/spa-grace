import { Component, inject, output, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpleadosService } from '../../../services/empleados.service';
import { ServiciosService } from '../../../services/servicios.service';
import { ToastService } from '../../../../shared/'components/toast-notification/toast.service';
import { passwordValidator } from '../../../../shared/'validators/password.validator';
import type { Empleado } from '../../../../core/'models/empleado.model';
import type { Servicio, CategoriaServicio } from '../../../../core/'models/servicio.model';

@Component({
  selector: 'app-empleado-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './empleado-form.component.html',
})
export class EmpleadoFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly empleadosService = inject(EmpleadosService);
  private readonly serviciosService = inject(ServiciosService);
  private readonly toast = inject(ToastService);

  readonly empleado = input<Empleado | null>(null);
  readonly close = output<void>();
  readonly saved = output<void>();

  readonly isSubmitting = signal(false);
  readonly especialidades = signal<any[]>([]);
  readonly categorias = signal<CategoriaServicio[]>([]);
  readonly serviciosPorCategoria = signal<{ categoria: CategoriaServicio; servicios: Servicio[] }[]>([]);
  readonly selectedServicios = signal<Set<number>>(new Set());

  readonly isEditing = signal(false);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(8), passwordValidator()]],
    telefono: [''],
    rol: ['terapeuta' as string, Validators.required],
    idEspecialidad: [0],
    activo: [true],
  });

  constructor() {
    this.cargarDatos();
    const e = this.empleado();
    if (e) {
      this.isEditing.set(true);
      this.form.patchValue({
        nombre: e.usuario?.nombre || '',
        email: e.usuario?.email || '',
        username: e.usuario?.username || '',
        telefono: e.usuario?.telefono || '',
        rol: e.usuario?.rol || 'terapeuta',
        idEspecialidad: e.idEspecialidad || 0,
        activo: e.activo,
      });
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
      if (e.servicios) {
        this.selectedServicios.set(new Set(e.servicios.map((s) => s.id)));
      }
    }
  }

  cargarDatos(): void {
    this.serviciosService.findAll({ activo: true, limit: 100 }).subscribe({
      next: (res) => {
        const categorias = new Map<number, { categoria: CategoriaServicio; servicios: Servicio[] }>();
        for (const s of res.data) {
          const cat = s.categoria;
          if (!cat) continue;
          if (!categorias.has(cat.id)) categorias.set(cat.id, { categoria: cat, servicios: [] });
          categorias.get(cat.id)!.servicios.push(s);
        }
        this.serviciosPorCategoria.set(Array.from(categorias.values()));
      },
    });
  }

  toggleServicio(id: number): void {
    this.selectedServicios.update((set) => {
      const copy = new Set(set);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.toast.show('Completá los campos requeridos', 'warning'); return; }
    if (this.selectedServicios().size === 0 && this.form.get('rol')?.value === 'terapeuta') {
      this.toast.show('Seleccioná al menos un servicio', 'warning'); return;
    }
    this.isSubmitting.set(true);
    const data = this.form.getRawValue();
    const payload: any = {
      usuario: { nombre: data.nombre, email: data.email, username: data.username, password: data.password, rol: data.rol, telefono: data.telefono || undefined },
      idEspecialidad: data.idEspecialidad || undefined,
      activo: data.activo,
      serviciosIds: Array.from(this.selectedServicios()),
    };
    if (this.isEditing() && data.password) payload.usuario.password = data.password;

    const e = this.empleado();
    const req = e ? this.empleadosService.update(e.id, payload) : this.empleadosService.create(payload);
    req.subscribe({
      next: () => { this.isSubmitting.set(false); this.toast.show(e ? 'Empleado actualizado' : 'Empleado creado', 'success'); this.saved.emit(); },
      error: (err) => { this.isSubmitting.set(false); this.toast.show(err.error?.message || 'Error', 'error'); },
    });
  }
}
