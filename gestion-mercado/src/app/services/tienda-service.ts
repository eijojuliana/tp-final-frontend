import { Injectable, Injector, signal } from '@angular/core';
import { NewTienda, Tienda } from '../models/tienda.model';
import { HttpClient } from '@angular/common/http';
import { filter, first, map, Observable, tap } from 'rxjs';
import { environment } from './ip';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TiendaService {
  private url = environment.apiBaseUrl + "/tiendas";

  private tiendaState = signal<Tienda[]>([]);
  public tiendas = this.tiendaState.asReadonly();

  private tiendaToEditState = signal<Tienda | null>(null);
  public tiendaToEdit = this.tiendaToEditState.asReadonly();

  private existeTiendaState = signal<boolean | undefined>(undefined);
  public existeTienda = this.existeTiendaState.asReadonly();

  private loadedState = signal<boolean>(false);

  constructor(private http:HttpClient, private injector:Injector,private auth:AuthService) {

     const rol = this.auth.getRole();

  if (!rol || rol === 'ADMIN' || rol === 'DUENIO') {
    this.load();
    this.checkExistencia();
  }
  }

  load(): void {
    this.http.get<Tienda[]>(this.url).pipe(
      tap(data => {
        this.tiendaState.set(data);
        this.existeTiendaState.set(data.length > 0);
        this.loadedState.set(true);
      })
    ).subscribe();
  }

  public get loaded$(): Observable<boolean> {
      return toObservable(this.loadedState, { injector: this.injector }).pipe(
          filter(isLoaded => isLoaded === true),
          first()
      );
  }

  public get hayTienda(): boolean {
    return this.tiendas().length > 0;
  }

  post(tienda:NewTienda):Observable<Tienda> {
    return this.http.post<Tienda>(this.url, tienda).pipe(
      tap ( () => this.load() )
    );
  }

  delete(id:number):Observable<Tienda> {
    return this.http.delete<Tienda>(`${this.url}/${id}`).pipe(
      tap(() => {
        this.tiendaState.update(currentTiendas => {
          const tiendas = currentTiendas.filter(t => t.tiendaId !== id);
          this.existeTiendaState.set(tiendas.length > 0);
          return tiendas;
        })
      })
    )
  }

  update(tienda:NewTienda, tiendaId:number):Observable<Tienda> {
    return this.http.put<Tienda>(`${this.url}/${tiendaId}`, tienda).pipe(
      tap( () => this.load() )
    );
  }

  selectTiendaToEdit(tienda:Tienda) {
    this.tiendaToEditState.set(tienda);
  }

  clearTiendaToEdit() {
    this.tiendaToEditState.set(null);
  }

  private checkExistencia(){
    this.http.get<Tienda[]>(this.url).pipe(
      first(), map(tiendas => tiendas.length > 0)
    ).subscribe({
      next: (hayTiendas: boolean) => this.existeTiendaState.set(hayTiendas),
    });
  }
}
