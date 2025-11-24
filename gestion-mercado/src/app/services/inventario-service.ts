import { Injectable, signal } from '@angular/core';
import { Inventario, newInventario } from '../models/inventario.model';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from './ip';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private url = environment.apiBaseUrl + "/inventarios";

  private inventarioState = signal<Inventario[]>([]);
  public inventarios = this.inventarioState.asReadonly();

  private inventarioToEditState = signal<Inventario | null>(null);
  public inventarioToEdit = this.inventarioToEditState.asReadonly();

  constructor(private http:HttpClient) { this.load(); }

  load() {
    this.http.get<Inventario[]>(this.url).subscribe(data =>
      this.inventarioState.set(data)
    )
  }

  post(inventario:newInventario):Observable<Inventario> {
    return this.http.post<Inventario>(this.url, inventario).pipe(
      tap( () => this.load() )
    );
  }

  delete(id:number):Observable<Inventario> {
    return this.http.delete<Inventario>(`${this.url}/${id}`).pipe(
      tap(() => {
        this.inventarioState.update(currentInventarios =>
          currentInventarios.filter(i => i.inventario_id !== id)
        )
      })
    )
  }

  update(inventario:Inventario):Observable<Inventario> {
    return this.http.put<Inventario>(`${this.url}/${inventario.inventario_id}`, inventario).pipe(
      tap( () => this.load() )
    );
  }

  // MÉTODOS DE DSP JE
  selectInventarioToEdit(inventario:Inventario) {
    this.inventarioToEditState.set(inventario);
  }

  clearInventarioToEdit() {
    this.inventarioToEditState.set(null);
  }
}
