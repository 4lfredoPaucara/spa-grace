import { Component, inject, output, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PromocionesService } from '../../../../services/promociones.service';
import { ServiciosService } from '../../../../services/servicios.service';
import { ToastService } from '../../../../shared/components/toast-notification/toast.service';
import type { Promocion } from '../../../../core/models/promocion.model';
import type { Servicio, CategoriaServicio } from '../../../../core/models/servicio.model';

@Component({
  selector: 'app-promocion-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './promocion-form.component.html',
})
export class PromocionFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(PromocionesService);
  private readonly serviciosService = inject(ServiciosService);
  private readonly toast = inject(ToastService);
  readonly promocion = input<Promocion | null>(null);
  readonly close = output<void>();
  readonly saved = output<void>();
  readonly isSubmitting = signal(false);
  readonly servicios = signal<Servicio[]>([]);
  readonly categorias = signal<CategoriaServicio[]>([]);

  readonly form = this.fb.nonNullable.group({
    titulo: ['', Validators.required],
    descripcion: [''],
    codigoDescuento: ['', Validators.required],
    tipoDescuento: ['porcentaje' as string, Validators.required],
    valorDescuento: [0, [Validators.required, Validators.min(0)]],
    aplicaA: ['todos' as string, Validators.required],
    idServicioAplicable: [0],
    idCategoriaAplicable: [0],
    fechaInicio: [''],
    fechaFin: [''],
    activo: [true],
    imagenUrl: [''],
  });

  constructor() {
    this.loadData();
    const p = this.promocion();
    if (p) {
      this.form.patchValue({
        titulo: p.titulo, descripcion: p.descripcion || '', codigoDescuento: p.codigoDescuento || '',
        tipoDescuento: p.tipoDescuento || 'porcentaje', valorDescuento: p.valorDescuento || 0,
        aplicaA: p.aplicaA, idServicioAplicable: p.idServicioAplicable || 0,
        idCategoriaAplicable: p.idCategoriaAplicable || 0,
        fechaInicio: p.fechaInicio || '', fechaFin: p.fechaFin || '', activo: p.activo, imagenUrl: p.imagenUrl || '',
      });
    }
  }

  loadData(): void {
    this.serviciosService.getPrincipales().subscribe(res => this.servicios.set(res.data));
    this.serviciosService.getCategorias().subscribe(res => this.categorias.set(res.data));
  }

  onSubmit(): void {
    if (this.form.invalid) { this.toast.show('Completá los campos requeridos', 'warning'); return; }
    this.isSubmitting.set(true);
    const data = this.form.getRawValue();
    const payload: any = {
      ...data,
      tipoDescuento: data.tipoDescuento as 'porcentaje' | 'fijo',
      aplicaA: data.aplicaA as 'todos' | 'servicio_especifico' | 'categoria' | 'cumpleanos',
      idServicioAplicable: data.idServicioAplicable || undefined,
      idCategoriaAplicable: data.idCategoriaAplicable || undefined,
    };
    const p = this.promocion();
    const req = p ? this.service.update(p.id, payload) : this.service.create(payload);
    req.subscribe({
      next: () => { this.isSubmitting.set(false); this.toast.show(p ? 'Actualizada' : 'Creada', 'success'); this.saved.emit(); },
      error: (err) => { this.isSubmitting.set(false); this.toast.show(err.error?.message || 'Error', 'error'); },
    });
  }
}
