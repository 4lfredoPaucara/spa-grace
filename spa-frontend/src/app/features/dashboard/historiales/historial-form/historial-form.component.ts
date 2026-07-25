import { Component, inject, output, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HistorialesService } from '../../../../services/historiales.service';
import { ToastService } from '../../../../shared/components/toast-notification/toast.service';
import type { HistorialClinico } from '../../../../core/models/historial.model';

@Component({
  selector: 'app-historial-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './historial-form.component.html',
})
export class HistorialFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(HistorialesService);
  private readonly toast = inject(ToastService);
  readonly historial = input<HistorialClinico | null>(null);
  readonly close = output<void>();
  readonly saved = output<void>();
  readonly isSubmitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    idCliente: [0, Validators.required],
    idTurno: [0],
    fecha: ['', Validators.required],
    diagnostico: [''],
    tratamiento: [''],
    notas: [''],
  });

  constructor() {
    const h = this.historial();
    if (h) {
      this.form.patchValue({ idCliente: h.idCliente, idTurno: h.idTurno || 0, fecha: h.fecha, diagnostico: h.diagnostico || '', tratamiento: h.tratamiento || '', notas: h.notas || '' });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.toast.show('Completá los campos requeridos', 'warning'); return; }
    this.isSubmitting.set(true);
    const data = this.form.getRawValue();
    const payload = { ...data, idTurno: data.idTurno || undefined };
    const h = this.historial();
    const req = h ? this.service.update(h.id, payload) : this.service.create(payload);
    req.subscribe({
      next: () => { this.isSubmitting.set(false); this.toast.show('Guardado', 'success'); this.saved.emit(); },
      error: (err) => { this.isSubmitting.set(false); this.toast.show(err.error?.message || 'Error', 'error'); },
    });
  }
}
