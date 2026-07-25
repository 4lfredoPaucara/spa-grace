import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    @if (loading()) {
      <div class="flex items-center justify-center" [class.p-8]="!overlay()">
        @if (overlay()) {
          <div class="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
            <div class="flex flex-col items-center gap-3">
              <div class="h-10 w-10 border-4 border-spa-primary/30 border-t-spa-primary rounded-full animate-spin"></div>
              @if (message()) {
                <p class="text-sm text-gray-500">{{ message() }}</p>
              }
            </div>
          </div>
        } @else {
          <div class="flex flex-col items-center gap-3">
            <div class="h-8 w-8 border-3 border-spa-primary/30 border-t-spa-primary rounded-full animate-spin"></div>
            @if (message()) {
              <p class="text-sm text-gray-500">{{ message() }}</p>
            }
          </div>
        }
      </div>
    }
  `,
})
export class LoadingSpinnerComponent {
  readonly loading = input(true);
  readonly overlay = input(false);
  readonly message = input<string>();
}
