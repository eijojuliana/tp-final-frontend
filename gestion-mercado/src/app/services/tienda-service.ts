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
        this.tiendaState.set(null);
        this.loadedState.set(true);
      }
    });
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
