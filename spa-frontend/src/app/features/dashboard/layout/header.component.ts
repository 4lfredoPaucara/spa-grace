import { Component, inject, computed, signal } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div>
        <h2 class="text-sm font-medium text-gray-500">Bienvenido,</h2>
        <p class="text-lg font-semibold text-spa-dark">{{ userName() }}</p>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative" (clickOutside)="toggleMenu()">
          <button
            (click)="toggleMenu()"
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="h-9 w-9 rounded-full bg-spa-primary/10 flex items-center justify-center text-spa-primary font-semibold text-sm">
              {{ userInitials() }}
            </div>
            <div class="text-left hidden sm:block">
              <p class="text-sm font-medium text-spa-dark">{{ userName() }}</p>
              <p class="text-xs text-gray-400 capitalize">{{ userRole() }}</p>
            </div>
            <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          @if (menuOpen()) {
            <div class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
              <a class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Mi Perfil
              </a>
              <hr class="my-1 border-gray-100"/>
              <a
                (click)="logout()"
                class="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
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
    const user = this.authService.currentUser();
    return user?.nombre ?? 'Usuario';
  });

  readonly userInitials = computed(() => {
    const name = this.userName();
    const parts = name.split(' ');
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
