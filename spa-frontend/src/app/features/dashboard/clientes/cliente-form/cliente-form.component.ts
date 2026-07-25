import { Component, computed, inject, output, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientesService } from '../../../services/clientes.service';
import { ToastService } from '../../../../shared/'components/toast-notification/toast.service';
import type { Cliente } from '../../../../core/'models/cliente.model';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cliente-form.component.html',
})
export class ClienteFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly clientesService = inject(ClientesService);
  private readonly toast = inject(ToastService);
  readonly cliente = input<Cliente | null>(null);
  readonly close = output<void>();
  readonly saved = output<void>();
  readonly isSubmitting = signal(false);
  readonly isEditing = computed(() => !!this.cliente());

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: [''],
    direccion: [''],
    ocupacion: [''],
    comoConocio: [''],
    alergias: [''],
    notasInternas: [''],
  });

  constructor() {
    const c = this.cliente();
    if (c && c.usuario) {
      this.form.patchValue({
        nombre: c.usuario.nombre || '',
        email: c.usuario.email || '',
        telefono: c.usuario.telefono || '',
        direccion: c.direccion || '',
        ocupacion: c.ocupacion || '',
        comoConocio: c.comoConocio || '',
        alergias: c.alergias || '',
        notasInternas: c.notasInternas || '',
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) { this.toast.show('Completá los campos requeridos', 'warning'); return; }
    this.isSubmitting.set(true);
    const data = this.form.getRawValue();
    const payload = {
      usuario: { nombre: data.nombre, email: data.email, phone: data.telefono },
      ...data,
      nombre: undefined, email: undefined, telefono: undefined,
    };
    const c = this.cliente();
    const req = c ? this.clientesService.update(c.id, payload) : this.clientesService.create(payload);
    req.subscribe({
      next: () => { this.isSubmitting.set(false); this.toast.show('Cliente guardado', 'success'); this.saved.emit(); },
      error: (err) => { this.isSubmitting.set(false); this.toast.show(err.error?.message || 'Error', 'error'); },
    });
  }
}
