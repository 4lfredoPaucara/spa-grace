import { Component, inject, output, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CobrosService } from '../../../services/cobros.service';
import { ToastService } from '../../../../shared/'components/toast-notification/toast.service';
import { CurrencyArsPipe } from '../../../../shared/'pipes/currency.pipe';
import type { Turno } from '../../../../core/'models/turno.model';

@Component({
  selector: 'app-pago-form',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyArsPipe],
  templateUrl: './pago-form.component.html',
})
export class PagoFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly cobrosService = inject(CobrosService);
  private readonly toast = inject(ToastService);

  readonly turno = input.required<Turno>();
  readonly mode = input.required<'adelanto' | 'final' | 'descuento' | 'reembolso'>();

  readonly close = output<void>();
  readonly saved = output<void>();

  readonly isSubmitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    montoAdelanto: [0, [Validators.required, Validators.min(1)]],
    metodoPagoAdelanto: ['efectivo', Validators.required],
    metodoPagoFinal: ['efectivo', Validators.required],
    codigoDescuento: ['', Validators.required],
    notas: [''],
  });

  onSubmit(): void {
    const cobroId = this.turno()?.cobro?.id;
    if (!cobroId) { this.toast.show('Error: no se encontró el cobro asociado', 'error'); return; }

    this.isSubmitting.set(true);
    const mode = this.mode();

    if (mode === 'adelanto') {
      const data = this.form.getRawValue();
      this.cobrosService.registrarAdelanto(cobroId, {
        montoAdelanto: data.montoAdelanto,
        metodoPagoAdelanto: data.metodoPagoAdelanto,
        notas: data.notas,
      }).subscribe({
        next: () => { this.isSubmitting.set(false); this.saved.emit(); },
        error: (err) => { this.isSubmitting.set(false); this.toast.show(err.error?.message || 'Error', 'error'); },
      });
    } else if (mode === 'final') {
      const data = this.form.getRawValue();
      this.cobrosService.registrarPagoFinal(cobroId, {
        metodoPagoFinal: data.metodoPagoFinal,
        notas: data.notas,
      }).subscribe({
        next: () => { this.isSubmitting.set(false); this.saved.emit(); },
        error: (err) => { this.isSubmitting.set(false); this.toast.show(err.error?.message || 'Error', 'error'); },
      });
    } else if (mode === 'descuento') {
      this.cobrosService.aplicarDescuento(cobroId, this.form.get('codigoDescuento')!.value).subscribe({
        next: () => { this.isSubmitting.set(false); this.saved.emit(); },
        error: (err) => { this.isSubmitting.set(false); this.toast.show(err.error?.message || 'Error', 'error'); },
      });
    } else if (mode === 'reembolso') {
      this.cobrosService.reembolsar(cobroId).subscribe({
        next: () => { this.isSubmitting.set(false); this.saved.emit(); },
        error: (err) => { this.isSubmitting.set(false); this.toast.show(err.error?.message || 'Error', 'error'); },
      });
    }
  }
}
