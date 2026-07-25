import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import type { Rol } from '../enums/rol.enum';

export function roleGuard(allowedRoles: Rol[]): CanActivateFn {
  return () => {
    const router = inject(Router);
    const userStr = localStorage.getItem('user');

    if (!userStr) {
      router.navigate(['/login']);
      return false;
    }

    try {
      const user = JSON.parse(userStr);
      if (allowedRoles.includes(user.rol)) {
        return true;
      }
      router.navigate(['/dashboard/home']);
      return false;
    } catch {
      router.navigate(['/login']);
      return false;
    }
  };
}
