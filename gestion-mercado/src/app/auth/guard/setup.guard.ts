import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { DuenioService } from '../../services/duenio-service';
import { TiendaService } from '../../services/tienda-service';
import { AuthService } from '../../auth/auth.service';  // 👈 ajustá la ruta si da error
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const setupGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> | boolean | UrlTree => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const duenioService = inject(DuenioService);
  const tiendaService = inject(TiendaService);

  const rol = auth.getRole(); // 'ADMIN', 'DUENIO' o 'EMPLEADO'


  if (rol === 'EMPLEADO') {
    return true;
  }


  return forkJoin({
    dueniosReady: duenioService.loaded$,
    tiendaReady: tiendaService.loaded$,
  }).pipe(
    map(() => {
      const hayTienda = tiendaService.hayTienda;
      const hayDuenios = duenioService.hayDuenios;

      // Ya existe tienda -> dejamos pasar
      if (hayTienda) {
        return true;
      }

      // No hay dueños -> llevar a crear dueño
      if (!hayDuenios) {
        return router.parseUrl('/menu/duenios/form');
      }

      // Hay dueños pero no tienda -> ir a crear tienda
      return router.parseUrl('/menu/tienda');
    }),
    // Si hubiera algún error raro (por ejemplo un 403 que se coló), no trabamos toda la app
    catchError(err => {
      console.error('Error en setupGuard:', err);
      return of(true as boolean);
    })
  );
};
