import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { DetallePedido, NewDetallePedido } from "../models/detallePedido.model";
import { environment } from "./ip";

@Injectable({
  providedIn: 'root',
})
export class DetallePedidoService {
  private apiUrlBase = environment.apiBaseUrl + "/detallespedido";
  private http = inject(HttpClient);


  load(pedidoId: number): Observable<DetallePedido[]> {
    return this.http.get<DetallePedido[]>(`${this.apiUrlBase}/porpedido/${pedidoId}`);
  }

  post(pedidoId: number, detalle: NewDetallePedido): Observable<boolean> {
    const url = `${this.apiUrlBase}/pedido/${pedidoId}`;
    return this.http.post<boolean>(url, detalle);
  }

  delete(detalleId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrlBase}/${detalleId}`);
  }

  update(id: number, detalle: NewDetallePedido): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrlBase}/${id}`, detalle);
  }
}
