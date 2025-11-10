import { Injectable, signal } from '@angular/core';
import { Inventario, newInventario } from '../models/inventario.model';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private url = "http://localhost:8080/api/inventarios";

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
      tap(newInventario => {
        this.inventarioState.update(currentInventarios => [...currentInventarios, newInventario])
      })
    )
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
      tap(updatedInventario => {
        this.inventarioState.update(currentInventarios =>
          currentInventarios.map(i => i.inventario_id === updatedInventario.inventario_id ? updatedInventario : i)
        )
      })
    )
  }

  // MÉTODOS DE DSP JE
  seleccionarInventarioToEdit(inventario:Inventario) {
    this.inventarioToEditState.set(inventario);
  }

  limpiarInventarioToEdit() {
    this.inventarioToEditState.set(null);
  }
}
