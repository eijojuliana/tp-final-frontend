import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { DuenioService } from '../../services/duenio-service';
import { TiendaService } from '../../services/tienda-service';
import { Observable, forkJoin, map } from 'rxjs';

export const setupGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const duenioService = inject(DuenioService);
  const tiendaService = inject(TiendaService);

  return forkJoin({
    dueniosReady: duenioService.loaded$,
    tiendaReady: tiendaService.loaded$
  }).pipe(
    map(() => {
      const hayTienda = tiendaService.hayTienda;
      const hayDuenios = duenioService.hayDuenios;

      if (hayTienda) {
        return true;
      }

      if (!hayDuenios) {
        return router.parseUrl('/menu/duenios/form');
      }

      return router.parseUrl('/menu/tienda');
    })
  );
};
