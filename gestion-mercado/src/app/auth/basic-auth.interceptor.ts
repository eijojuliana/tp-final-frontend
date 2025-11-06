// basic-auth.interceptor.ts
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authHeaderValue = this.authService.getAuthHeaderValue();

    console.log('Interceptor ejecutándose. Valor del encabezado:', authHeaderValue);

    // Si tenemos un valor de cabecera de autenticación, lo adjuntamos
    if (authHeaderValue) {
      // Clona la petición (las peticiones en Angular son inmutables) y añade el nuevo encabezado
      const authRequest = request.clone({
        setHeaders: {
          Authorization: authHeaderValue
        }
      });
      return next.handle(authRequest); // Envía la petición modificada
    }

    // Si no hay credenciales, continúa con la petición original
    return next.handle(request);
  }
}

export const BasicAuthInterceptorFn: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  
  // 1. Inyecta el AuthService dentro de la función interceptor
  const authService = inject(AuthService);
  const authHeaderValue = authService.getAuthHeaderValue();
  
  // Si esta línea no se muestra, el problema es que el service no se cargó correctamente
  console.log('--- Interceptor Fn Ejecutándose. Header:', authHeaderValue); 

  if (authHeaderValue) {
    // 2. Clona y añade el encabezado 'Authorization'
    const cloned = req.clone({
      headers: req.headers.set('Authorization', authHeaderValue)
    });
    return next(cloned);
  }

  // 3. Pasa la solicitud original si no hay encabezado
  return next(req);
};