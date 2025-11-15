import { Injectable, signal } from '@angular/core';
import { NewTienda, Tienda } from '../models/tienda.model';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TiendaService {
  private url = "http://localhost:8080/api/tiendas";

  private tiendaState = signal<Tienda[]>([]);
  public tiendas = this.tiendaState.asReadonly();

  private tiendaToEditState = signal<Tienda | null>(null);
  public tiendaToEdit = this.tiendaToEditState.asReadonly();

  constructor(private http:HttpClient) { this.load(); }

  load() {
    this.http.get<Tienda[]>(this.url).subscribe(data =>
      this.tiendaState.set(data)
    )
  }

  post(tienda:NewTienda):Observable<Tienda> {
    return this.http.post<Tienda>(this.url, tienda).pipe(
      tap ( () => this.load() )
    );
  }

  delete(id:number):Observable<Tienda> {
    return this.http.delete<Tienda>(`${this.url}/${id}`).pipe(
      tap(() => {
        this.tiendaState.update(currentTiendas =>
          currentTiendas.filter(t => t.tiendaId !== id)
        )
      })
    )
  }

  update(tienda:NewTienda, tiendaId:number):Observable<Tienda> {
    return this.http.put<Tienda>(`${this.url}/${tiendaId}`, tienda).pipe(
      tap( () => this.load() )
    );
  }

  seleccionarTiendaToEdit(tienda:Tienda) {
    this.tiendaToEditState.set(tienda);
  }

  limpiarTiendaToEdit() {
    this.tiendaToEditState.set(null);
  }
}
