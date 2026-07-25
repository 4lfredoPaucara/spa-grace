import { Component, inject, output, input, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PagosEmpleadosService } from '../../../../services/pagos-empleados.service';
import { EmpleadosService } from '../../../../services/empleados.service';
import { ToastService } from '../../../../shared/components/toast-notification/toast.service';
import type { PagoEmpleado } from '../../../../core/models/pago-empleado.model';
import type { Empleado } from '../../../../core/models/empleado.model';

@Component({
  selector: 'app-pago-empleado-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pago-empleado-form.component.html',
})
export class PagoEmpleadoFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(PagosEmpleadosService);
  private readonly empleadosService = inject(EmpleadosService);
  private readonly toast = inject(ToastService);

  readonly pago = input<PagoEmpleado | null>(null);
  readonly close = output<void>();
  readonly saved = output<void>();

  readonly isSubmitting = signal(false);
  readonly empleados = signal<Empleado[]>([]);

  readonly form = this.fb.nonNullable.group({
    idEmpleado: [0, Validators.required],
    fechaPago: ['', Validators.required],
    periodoInicio: ['', Validators.required],
    periodoFin: ['', Validators.required],
    montoBruto: [0, [Validators.required, Validators.min(0)]],
    deducciones: [0, Validators.min(0)],
    metodoPago: ['transferencia'],
    referenciaPago: [''],
    notas: [''],
  });

  readonly montoNetoCalculado = computed(() =>
    this.form.get('montoBruto')!.value - this.form.get('deducciones')!.value
  );

  constructor() {
    this.empleadosService.findAll({ limit: 100 }).subscribe((res) => this.empleados.set(res.data));
    const p = this.pago();
    if (p) {
      this.form.patchValue({
        idEmpleado: p.idEmpleado,
        fechaPago: p.fechaPago,
        periodoInicio: p.periodoInicio,
        periodoFin: p.periodoFin,
        montoBruto: p.montoBruto,
        deducciones: p.deducciones,
        metodoPago: p.metodoPago || '',
        referenciaPago: p.referenciaPago || '',
        notas: p.notas || '',
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.toast.show('Completa los campos', 'warning'); return; }
    this.isSubmitting.set(true);
    const data = this.form.getRawValue();
    const p = this.pago();
    const req = p ? this.service.update(p.id, data as any) : this.service.create(data);
    req.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.toast.show(p ? 'Actualizado' : 'Creado', 'success');
        this.saved.emit();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.toast.show(err.error?.message || 'Error', 'error');
      },
    });
  }
}
