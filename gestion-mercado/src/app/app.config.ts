import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BasicAuthInterceptorFn } from './auth/basic-auth.interceptor';
import { AuthService } from './auth/auth.service';
import { errorInterceptor} from './interceptors/error.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-AR';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        BasicAuthInterceptorFn,
        errorInterceptor
      ])
    ),
    provideCharts(withDefaultRegisterables()),
    AuthService,
    { provide: LOCALE_ID, useValue: 'es-AR' }
  ]
};
