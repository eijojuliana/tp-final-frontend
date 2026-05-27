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

  const rol = auth.getRole(); // 'ADMIN', 'DUENIO' o 'EMPLEADO'
  const currentUrl = state.url;

  // Los empleados no configuran la tienda, pasan directo
  if (rol == 'EMPLEADO' || rol == 'Empleado') {
    return true;
  }

  return forkJoin({
    dueniosReady: duenioService.loaded$,
    tiendaReady: tiendaService.loaded$,
  }).pipe(
    map(() => {
      const verificarTienda = tiendaService.verificarTienda;
      const hayDuenios = duenioService.hayDuenios;

      // Si ya estamos en el formulario de tienda, permitir acceso
      if (currentUrl === '/configuracion-tienda') {
        return true;
      }
      console.log('Buscando registros...')

      // Si no hay dueños, obligar a crear uno primero
      if (!hayDuenios) {
        if (currentUrl === '/menu/duenios/form') return true;
        toast.error('Debe registrar un dueño primero.');
        return router.parseUrl('/menu/duenios/form');
      }
      console.log('Dueño encontrado...')

      // Si hay dueños pero no hay tienda, obligar a configurar tienda
      if (!verificarTienda) {
        toast.error('Debe configurar los datos de la tienda.');
        return router.parseUrl('/configuracion-tienda');
      }
      console.log('Tienda encontrada...')

      return true;
    })
  );
};
