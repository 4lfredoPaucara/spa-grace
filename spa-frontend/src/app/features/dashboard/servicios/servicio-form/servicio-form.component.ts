import { Component, inject, output, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiciosService } from '../../../services/servicios.service';
import { ToastService } from '../../../../shared/'components/toast-notification/toast.service';
import type { Servicio } from '../../../../core/'models/servicio.model';
import type { CategoriaServicio } from '../../../../core/'models/servicio.model';

@Component({
  selector: 'app-servicio-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './servicio-form.component.html',
})
export class ServicioFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly serviciosService = inject(ServiciosService);
  private readonly toast = inject(ToastService);

  readonly servicio = input<Servicio | null>(null);
  readonly close = output<void>();
  readonly saved = output<void>();

  readonly isSubmitting = signal(false);
  readonly categorias = signal<CategoriaServicio[]>([]);
  readonly principales = signal<Servicio[]>([]);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: [''],
    idCategoria: [0, Validators.required],
    duracion: [60, [Validators.required, Validators.min(0)]],
    precio: [0, [Validators.required, Validators.min(0)]],
    tipo: ['principal' as 'principal' | 'addon', Validators.required],
    parentServicioId: [0],
    activo: [true],
    imagenUrl: [''],
  });

  constructor() {
    this.cargarCategorias();
    this.cargarPrincipales();

    const s = this.servicio();
    if (s) {
      this.form.patchValue({
        nombre: s.nombre,
        descripcion: s.descripcion || '',
        idCategoria: s.idCategoria || 0,
        duracion: s.duracion,
        precio: s.precio,
        tipo: s.tipo,
        parentServicioId: s.parentServicioId || 0,
        activo: s.activo,
        imagenUrl: s.imagenUrl || '',
      });
    }

    this.form.get('tipo')?.valueChanges.subscribe((tipo) => {
      if (tipo === 'principal') {
        this.form.get('parentServicioId')?.setValue(0);
        this.form.get('parentServicioId')?.clearValidators();
      } else {
        this.form.get('parentServicioId')?.setValidators([Validators.required, Validators.min(1)]);
      }
      this.form.get('parentServicioId')?.updateValueAndValidity();
    });
  }

  cargarCategorias(): void {
    this.serviciosService.getCategorias().subscribe({
      next: (res) => this.categorias.set(res.data),
    });
  }

  cargarPrincipales(): void {
    this.serviciosService.getPrincipales().subscribe({
      next: (res) => this.principales.set(res.data),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.toast.show('Completá los campos requeridos', 'warning'); return; }
    this.isSubmitting.set(true);
    const data = this.form.getRawValue();
    const payload: any = { ...data, idCategoria: data.idCategoria || undefined, parentServicioId: data.parentServicioId || undefined };
    const s = this.servicio();
    const req = s ? this.serviciosService.update(s.id, payload) : this.serviciosService.create(payload);
    req.subscribe({
      next: () => { this.isSubmitting.set(false); this.toast.show(s ? 'Servicio actualizado' : 'Servicio creado', 'success'); this.saved.emit(); },
      error: (err) => { this.isSubmitting.set(false); this.toast.show(err.error?.message || 'Error', 'error'); },
    });
  }
}
