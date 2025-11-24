import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DuenioService } from '../../services/duenio-service';
import { TiendaService } from '../../services/tienda-service';

export const setupGuard: CanActivateFn = () => {
  const duenioService = inject(DuenioService);
  const tiendaService = inject(TiendaService);
  const router = inject(Router);

  const existeDuenio = duenioService.existeDuenio();
  const existeTienda = tiendaService.existeTienda();

  if (!existeDuenio) {
    return router.parseUrl('/menu/duenios/form');
  }

  if (!existeTienda) {
    return router.parseUrl('/menu/tienda');
  }

  return true;
};
