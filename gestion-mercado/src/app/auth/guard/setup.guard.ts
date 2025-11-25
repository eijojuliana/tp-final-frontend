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
    hayTienda: tiendaService.tiendaCargada$.pipe(map(() => tiendaService.tiendas().length > 0)),
    hayDuenios: duenioService.dueniosCargados$.pipe(map(() => duenioService.duenios().length > 0)),
  }).pipe(
    map(({ hayTienda, hayDuenios }) => {
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
