import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" (click)="cancel.emit()"></div>
        <div class="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold text-spa-dark mb-2">{{ title() }}</h3>
          <p class="text-sm text-gray-600 mb-6">{{ message() }}</p>
          <div class="flex justify-end gap-3">
            <button class="btn-spa-secondary" (click)="cancel.emit()">Cancelar</button>
            <button
              [class]="confirmVariant() === 'danger' ? 'btn-spa-danger' : 'btn-spa-primary'"
              (click)="confirm.emit()"
            >
              {{ confirmText() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly title = input('Confirmar acción');
  readonly message = input('Estás seguro de que deseas continuar?');
  readonly confirmText = input('Confirmar');
  readonly confirmVariant = input<'primary' | 'danger'>('primary');

  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
