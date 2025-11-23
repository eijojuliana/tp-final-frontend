import { Injectable, signal } from '@angular/core';
import { Observable, of, switchMap, tap } from 'rxjs';
import { Pedido, NewPedido } from '../models/pedido.model';
import { HttpClient } from '@angular/common/http';
import { environment } from './ip';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private url = environment.apiBaseUrl + "/pedidos";

  private pedidosState = signal<Pedido[]>([]);
  public pedidos = this.pedidosState.asReadonly();

  private pedidoToEditState = signal<Pedido | null>(null);
  public pedidoToEdit = this.pedidoToEditState.asReadonly();

  constructor(private http: HttpClient) {
    this.load();
  }

  load() {
    this.http.get<Pedido[]>(this.url).subscribe(
      data => this.pedidosState.set(data)
    );
  }

  getById(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.url}/${id}`);
  }

  post(pedido: NewPedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.url, pedido).pipe(
      tap( () => this.load() )
    );
  }

  delete(id: number): Observable<Pedido> {
    return this.http.delete<Pedido>(`${this.url}/${id}`).pipe(
      tap(() => {
        this.pedidosState.update((currentPedidos) =>
          currentPedidos.filter((pedido) => pedido.pedidoId !== id)
        );
      })
    );
  }

  update(pedidoToUpdate: NewPedido, id:number): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.url}/${id}`, pedidoToUpdate).pipe(
      tap( () => this.load() )
    );
  }

  selectPedidoToEdit(pedido: Pedido) {
    this.pedidoToEditState.set(pedido);
  }

  clearPedidoToEdit() {
    this.pedidoToEditState.set(null);
  }

  finalizar(id: number): Observable<boolean> {
  return this.http.put<boolean>(`${this.url}/${id}/finalizar`, {});
  }
}
