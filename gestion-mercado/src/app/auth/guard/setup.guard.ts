import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { DuenioService } from '../../services/duenio-service';
import { TiendaService } from '../../services/tienda-service';
import { AuthService } from '../../auth/auth.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastService } from '../../services/toast.service';

export const setupGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> | boolean | UrlTree => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const duenioService = inject(DuenioService);
  const tiendaService = inject(TiendaService);
  const toast = inject(ToastService);

  const rol = auth.getRole();
  const currentUrl = state.url;

  if (rol == 'EMPLEADO' || rol == 'Empleado') {
    return true;
  }

  duenioService.load();
  tiendaService.load();

  return forkJoin({
    dueniosReady: duenioService.loaded$,
    tiendaReady: tiendaService.loaded$,
  }).pipe(
    map(() => {
      const hayDuenios = duenioService.hayDuenios;
      const hayTienda = tiendaService.hayTienda;

      if (currentUrl === '/configuracion-tienda') {
        return true;
      }

      if (!hayDuenios) {
        if (currentUrl === '/menu/duenios/form') return true;
        toast.error('Debe registrar un dueño primero.');
        return router.parseUrl('/menu/duenios/form');
      }

      if (!hayTienda) {
        toast.error('Debe configurar los datos de la tienda.');
        return router.parseUrl('/configuracion-tienda');
      }

      return true;
    })
  );
};
