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

  isCajaCerradaHoy = signal<boolean>(false);

  constructor(private http: HttpClient) {
  }

  load() {
    this.http.get<Pedido[]>(this.url).subscribe({
      next: data => this.pedidosState.set(data),
      error: () => {}
    });
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
    return this.http.put<boolean>(`${this.url}/${id}/finalizar`, {}).pipe(
      tap(()=>this.load())
    );
  }

  exportarExcel() {
    return this.http.get(`${this.url}/exportar`, {
      responseType: 'blob'
    }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte-pedidos.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  verificarEstadoCaja() {
    const hoy = new Date().toLocaleDateString('en-CA');

    this.http.get<string>(`${environment.apiBaseUrl}/configuracion-tienda/ultimoCierre`).subscribe({
      next: (fechaCierre) => {
        // Si la fecha que devuelve el back es igual a hoy, el semáforo pasa a true
        if (!fechaCierre) {
          this.isCajaCerradaHoy.set(false);
        } else {
          this.isCajaCerradaHoy.set(fechaCierre === hoy);
        }
      },
      error: () => this.isCajaCerradaHoy.set(false) // Por seguridad, si falla asume abierta
    });
  }
}
