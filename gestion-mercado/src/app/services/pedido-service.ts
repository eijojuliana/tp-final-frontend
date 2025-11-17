import { Injectable, signal } from '@angular/core';
import { Observable, of, switchMap, tap } from 'rxjs';
import { Pedido, NewPedido } from '../models/pedido.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private url = 'http://localhost:8080/api/pedidos';

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

  update(pedidoToUpdate: Pedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.url}/${pedidoToUpdate.pedidoId}`, pedidoToUpdate).pipe(
      tap( () => this.load() )
    );
  }

  selectPedidoToEdit(pedido: Pedido) {
    this.pedidoToEditState.set(pedido);
  }

  clearPedidoToEdit() {
    this.pedidoToEditState.set(null);
  }
}
