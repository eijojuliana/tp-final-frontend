import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { DetallePedido, NewDetallePedido } from "../models/detallePedido.model";

@Injectable({
  providedIn: 'root',
})
export class DetallePedidoService {
  private apiUrlBase = 'http://localhost:8080/api/detallespedido';
  private http = inject(HttpClient);


  getDetallesByPedidoId(pedidoId: number): Observable<DetallePedido[]> {
    return this.http.get<DetallePedido[]>(`${this.apiUrlBase}/porpedido/${pedidoId}`);
  }

  agregarDetalle(pedidoId: number, detalle: NewDetallePedido): Observable<boolean> {
    const url = `${this.apiUrlBase}/pedido/${pedidoId}`;
    return this.http.post<boolean>(url, detalle);
  }

  eliminarDetalle(detalleId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrlBase}/${detalleId}`);
  }
}
