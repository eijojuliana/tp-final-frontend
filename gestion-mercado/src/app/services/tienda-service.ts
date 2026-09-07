import { catchError, map, of, filter, first, Observable, tap} from 'rxjs';
import { Injectable, Injector, signal } from '@angular/core';
import { newTienda, Tienda } from '../models/tienda.model';
import { HttpClient } from '@angular/common/http';
import { environment } from './ip';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class TiendaService {
  private url = environment.apiBaseUrl + "/configuracion-tienda";

  private tiendaState = signal<Tienda | null>(null);
  public tienda = this.tiendaState.asReadonly();
  private loadedState = signal<boolean>(false);

  constructor(private http: HttpClient, private injector: Injector) {
  }

  load(): void {
    this.loadedState.set(false);
    this.http.get<Tienda>(`${this.url}/1`).subscribe({
      next: (data) => {
        if (data && Object.keys(data).length > 0 && data.tiendaId > 0) {
          this.tiendaState.set(data);
        } else {
          this.tiendaState.set(null);
        }
        this.loadedState.set(true);
      },
      error: () => {
        // Si ya teníamos datos, no los piso con null (evita que el saldo
        // mostrado "se ponga en 0" por un error transitorio de la petición).
        if (!this.tienda()) {
          this.tiendaState.set(null);
        }
        this.loadedState.set(true);
      }
    });
  }

  // Actualiza el saldo de la caja de forma optimista (cambia al instante en
  // pantalla) y después re-sincroniza con el servidor para el valor real.
  aplicarCambioCaja(delta: number): void {
    const actual = this.tienda();
    if (actual) {
      this.tiendaState.set({
        ...actual,
        caja: (Number(actual.caja) || 0) + delta,
      });
    }
    this.load();
  }

  public get loaded$(): Observable<boolean> {
    return toObservable(this.loadedState, { injector: this.injector }).pipe(
      filter(isLoaded => isLoaded === true),
      first()
    );
  }

  post(tienda:newTienda):Observable<Tienda> {
    return this.http.post<Tienda>(this.url, tienda).pipe(
      tap ( () => this.load() )
    );
  }

  public get hayTienda(): boolean {
    const t = this.tienda();
    return !!t && t.tiendaId > 0 && !!t.razonSocial;
  }

  verificarTienda(): Observable<boolean> {
    return this.http.get<Tienda>(`${this.url}/1`).pipe(
      map(t => !!t && t.tiendaId > 0),
      catchError(() => of(false))
    );
  }

  cerrarCaja(): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/cerrarCaja`).pipe(
      tap(()=>this.load())
    );
  }

  abrirCaja(email: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/abrir-caja`, { email, password }).pipe(
      tap(() => this.load())
    );
  }

  update(tienda: any): Observable<boolean> {
    return this.http.put<any>(`${this.url}/${tienda.tiendaId}`, tienda).pipe(
      map(() => true), // Si no hay error, asumimos éxito
      tap(() => this.load()), // Refrescamos el signal local con los datos del servidor
      catchError((err) => {
        console.error("Error al actualizar:", err);
        return of(false);
      })
    );
  }
}
