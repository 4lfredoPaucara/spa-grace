import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', route: '/dashboard/home', roles: [] },
  { label: 'Agenda', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', route: '/dashboard/agenda', roles: ['admin', 'recepcionista'] },
  { label: 'Clientes', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', route: '/dashboard/clientes', roles: ['admin', 'recepcionista'] },
  { label: 'Servicios', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', route: '/dashboard/servicios', roles: ['admin'] },
  { label: 'Personal', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', route: '/dashboard/personal', roles: ['admin'] },
  { label: 'Promociones', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', route: '/dashboard/promociones', roles: ['admin'] },
  { label: 'Historiales', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', route: '/dashboard/historiales', roles: ['admin', 'recepcionista', 'terapeuta'] },
  { label: 'Disponibilidad', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', route: '/dashboard/disponibilidad', roles: ['admin'] },
  { label: 'Pagos Empleados', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z', route: '/dashboard/pagos-empleados', roles: ['admin'] },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 bg-spa-dark flex flex-col shrink-0">
      <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
        <div class="h-8 w-8 rounded-lg bg-spa-primary flex items-center justify-center text-white font-bold text-sm">G</div>
        <div>
          <h1 class="text-white font-semibold text-sm">SpaGrace</h1>
          <p class="text-gray-400 text-xs">Panel de Gestión</p>
        </div>
      </div>

      <nav class="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        @for (item of filteredMenu(); track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-spa-primary text-white"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard/home' }"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-700/50 transition-colors"
          >
            <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="item.icon"/>
            </svg>
            {{ item.label }}
          </a>
        }
      </nav>

      <div class="px-4 py-3 border-t border-gray-700">
        <div class="text-xs text-gray-500">SpaGrace v2.0</div>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);

  readonly filteredMenu = computed(() => {
    const rol = this.authService.userRole();
    if (!rol) return [];
    return MENU_ITEMS.filter((item) => item.roles.length === 0 || item.roles.includes(rol));
  });
}
