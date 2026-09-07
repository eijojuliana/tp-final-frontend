import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err) => {

      const status = err.status;

      let msg: string;


      if (status === 401 && req.url.includes('/auth/profile')) {
        msg = 'Usuario o contraseña incorrectos';
      } else if (status === 403) {
        msg = 'Acceso denegado: no tenés permisos para esta acción';
        router.navigate(['/acceso-denegado']);
      } else if (status === 500) {
        msg = 'Error interno del servidor';
      } else {
        msg =
          err?.error?.mensaje ||
          err?.error?.message ||
          err?.message ||
          'Error desconocido';
      }

      console.error(`[ERROR ${status}] ${msg}`, err);

      toast.error(msg);

      return throwError(() => err);
    })
  );
};
