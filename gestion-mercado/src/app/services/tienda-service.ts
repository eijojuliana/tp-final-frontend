import { Injectable, Injector, signal } from '@angular/core';
import { NewTienda, Tienda } from '../models/tienda.model';
import { HttpClient } from '@angular/common/http';
import { filter, first, map, Observable, tap } from 'rxjs';
import { environment } from './ip';
import { toObservable } from '@angular/core/rxjs-interop';

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

  constructor(private http:HttpClient, private injector:Injector) {
    this.load();
    this.checkExistencia();
  }

  public get tiendaCargada$(): Observable<boolean> {
    return toObservable(this.existeTienda, { injector: this.injector }).pipe(
      filter((val): val is boolean => val !== undefined),
      first()
    );
  }

  load() {
    this.http.get<Tienda[]>(this.url).subscribe(data => {
      this.tiendaState.set(data);
      this.existeTiendaState.set(data.length > 0);
    });
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
