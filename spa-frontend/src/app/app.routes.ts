import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./features/dashboard/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'agenda',
        canActivate: [roleGuard(['admin', 'recepcionista'])],
        loadComponent: () => import('./features/dashboard/agenda/agenda.component').then(m => m.AgendaComponent),
      },
      {
        path: 'servicios',
        canActivate: [roleGuard(['admin'])],
        loadComponent: () => import('./features/dashboard/servicios/servicios.component').then(m => m.ServiciosComponent),
      },
      {
        path: 'personal',
        canActivate: [roleGuard(['admin'])],
        loadComponent: () => import('./features/dashboard/personal/personal.component').then(m => m.PersonalComponent),
      },
      {
        path: 'clientes',
        canActivate: [roleGuard(['admin', 'recepcionista'])],
        loadComponent: () => import('./features/dashboard/clientes/clientes.component').then(m => m.ClientesComponent),
      },
      {
        path: 'promociones',
        canActivate: [roleGuard(['admin'])],
        loadComponent: () => import('./features/dashboard/promociones/promociones.component').then(m => m.PromocionesComponent),
      },
      {
        path: 'historiales',
        canActivate: [roleGuard(['admin', 'recepcionista', 'terapeuta'])],
        loadComponent: () => import('./features/dashboard/historiales/historiales.component').then(m => m.HistorialesComponent),
      },
      {
        path: 'disponibilidad',
        canActivate: [roleGuard(['admin'])],
        loadComponent: () => import('./features/dashboard/disponibilidad/disponibilidad.component').then(m => m.DisponibilidadComponent),
      },
      {
        path: 'pagos-empleados',
        canActivate: [roleGuard(['admin'])],
        loadComponent: () => import('./features/dashboard/pagos-empleados/pagos-empleados.component').then(m => m.PagosEmpleadosComponent),
      },
    ],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];
