import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium min-w-[300px] animate-slide-in"
          [class]="getToastClass(toast.type)"
        >
          <span class="flex-1">{{ toast.message }}</span>
          <button class="opacity-70 hover:opacity-100" (click)="toastService.dismiss(toast.id)">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }
  `],
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  getToastClass(type: string): string {
    switch (type) {
      case 'success': return 'bg-green-50 text-green-800 border border-green-200';
      case 'error': return 'bg-red-50 text-red-800 border border-red-200';
      case 'warning': return 'bg-yellow-50 text-yellow-800 border border-yellow-200';
      default: return 'bg-blue-50 text-blue-800 border border-blue-200';
    }
  }
}
