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
  { label: 'Home', route: '/dashboard/home', roles: [],
    icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
  { label: 'Agenda', route: '/dashboard/agenda', roles: ['admin', 'recepcionista'],
    icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' },
  { label: 'Clientes', route: '/dashboard/clientes', roles: ['admin', 'recepcionista'],
    icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
  { label: 'Servicios', route: '/dashboard/servicios', roles: ['admin'],
    icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42' },
  { label: 'Personal', route: '/dashboard/personal', roles: ['admin'],
    icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' },
  { label: 'Promociones', route: '/dashboard/promociones', roles: ['admin'],
    icon: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z' },
  { label: 'Historiales', route: '/dashboard/historiales', roles: ['admin', 'recepcionista', 'terapeuta'],
    icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { label: 'Disponibilidad', route: '/dashboard/disponibilidad', roles: ['admin'],
    icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Pagos Empleados', route: '/dashboard/pagos-empleados', roles: ['admin'],
    icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z' },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="w-64 bg-spa-dark flex flex-col shrink-0 h-screen">
      <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-700/50">
        <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-spa-primary to-spa-secondary flex items-center justify-center text-white font-bold text-base shadow-lg shadow-spa-primary/20">
          G
        </div>
        <div>
          <h1 class="text-white font-semibold text-base leading-tight">SpaGrace</h1>
          <p class="text-gray-400 text-xs">Panel de Gestión</p>
        </div>
      </div>

      <nav class="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
        @for (item of filteredMenu(); track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-spa-primary text-white shadow-md shadow-spa-primary/20"
            [routerLinkActiveOptions]="{ exact: item.route === '/dashboard/home' }"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700/60 hover:text-white transition-all duration-150"
          >
            <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="item.icon"/>
            </svg>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <div class="px-4 py-3 border-t border-gray-700/50">
        <p class="text-[10px] text-gray-600 uppercase tracking-wider font-medium">SpaGrace v2.0</p>
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
