import { Component, inject, computed, signal } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div>
        <h2 class="text-sm font-medium text-gray-500 leading-tight">Bienvenido,</h2>
        <p class="text-lg font-semibold text-spa-dark leading-tight">{{ userName() }}</p>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative">
          <button
            type="button"
            (click)="toggleMenu()"
            class="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="h-9 w-9 rounded-full bg-spa-primary/10 flex items-center justify-center text-spa-primary font-semibold text-sm ring-2 ring-spa-primary/20">
              {{ userInitials() }}
            </div>
            <div class="text-left hidden sm:block">
              <p class="text-sm font-medium text-spa-dark leading-tight">{{ userName() }}</p>
              <p class="text-xs text-gray-400 capitalize leading-tight">{{ userRole() }}</p>
            </div>
            <svg class="h-4 w-4 text-gray-400 transition-transform" [class.rotate-180]="menuOpen()" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
            </svg>
          </button>

          @if (menuOpen()) {
            <div class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
              <div class="px-4 py-2.5 border-b border-gray-50">
                <p class="text-sm font-medium text-spa-dark">{{ userName() }}</p>
                <p class="text-xs text-gray-400">{{ userEmail() }}</p>
              </div>
              <a
                (click)="logout()"
                class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/>
                </svg>
                Cerrar Sesión
              </a>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  readonly menuOpen = signal(false);

  readonly userRole = computed(() => this.authService.userRole());

  readonly userName = computed(() => {
    return this.authService.currentUser()?.nombre ?? 'Usuario';
  });

  readonly userEmail = computed(() => {
    return this.authService.currentUser()?.email ?? '';
  });

  readonly userInitials = computed(() => {
    const name = this.userName();
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.menuOpen.set(false);
    }
  }

  logout() {
    this.menuOpen.set(false);
    this.authService.logout();
  }
}
