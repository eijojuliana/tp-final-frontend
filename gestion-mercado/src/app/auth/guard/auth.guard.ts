// src/app/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';


export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Si no está logueado, lo mando al login
  if (!auth.isLoggedIn()) {
    return router.parseUrl('/login');
  }

  // Si la ruta no pidió roles específicos, alcanza con que esté logueado
  const rolesPermitidos = route.data?.['roles'] as string[] | undefined;
  if (!rolesPermitidos || rolesPermitidos.length === 0) {
    return true;
  }

  // Si la ruta pidió roles, reviso el rol actual
  if (auth.hasRole(rolesPermitidos)) {
    return true;
  }

  // Si está logueado pero no tiene permiso, lo devuelvo al login (o podrías hacer /no-autorizado)
  return router.parseUrl('/login');
};
