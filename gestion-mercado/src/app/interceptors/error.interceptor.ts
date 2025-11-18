import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((err) => {

      const status = err.status;
      const msg =
        err?.error?.mensaje ||
        err?.error?.message ||
        err?.message ||
        'Error desconocido';

      console.error(`[ERROR ${status}] ${msg}`);

      toast.error(msg);

      return throwError(() => err);
    })
  );
};
