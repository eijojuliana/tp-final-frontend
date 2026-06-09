import { Injectable, signal, inject } from '@angular/core';
import { NewTransaccion, Transaccion } from '../models/transaccion.model';
import { HttpClient } from '@angular/common/http';
import { Observable, concatMap, tap } from 'rxjs';
import { environment } from './ip';
import { TiendaService } from './tienda-service';

@Injectable({
  providedIn: 'root',
})
export class TransaccionService {
  private tiendaService = inject(TiendaService);
  private url = environment.apiBaseUrl + "/transacciones";

  private transaccionesState = signal<Transaccion[]>([]);
  public transacciones = this.transaccionesState.asReadonly();

  private transaccionToEditState = signal<Transaccion | null>(null);
  public transaccionToEdit = this.transaccionToEditState.asReadonly();

  constructor(private http:HttpClient){
    this.load();
  }

  private fetchTransacciones(): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(this.url).pipe(
      tap(data => this.transaccionesState.set(data))
    );
  }

  load() {
    this.fetchTransacciones().subscribe();
  }

  post(transaccion: NewTransaccion): Observable<Transaccion> {
    return this.http.post<Transaccion>(this.url, transaccion).pipe(
      tap(() => this.load())
    );
  }

  update(transaccion: Transaccion): Observable<Transaccion> {
    return this.http.put<Transaccion>(`${this.url}/${transaccion.transaccion_id}`, transaccion).pipe(
      tap(() => this.load())
    );
  }

  delete(id: number): Observable<Transaccion> {
    return this.http.delete<Transaccion>(`${this.url}/${id}`).pipe(
      tap(() => {
        this.transaccionesState.update(current =>
          current.filter(t => t.transaccion_id !== id)
        );
      })
    );
  }

  registrarMovimiento(movimiento: NewTransaccion): Observable<Transaccion[]> {
    return this.http.post<Transaccion>(`${this.url}/movimiento`, movimiento).pipe(
      concatMap(() => this.fetchTransacciones()),
      tap(() => this.tiendaService.load())
    );
  }

  selectTransaccionToEdit(transaccion: Transaccion) {
    this.transaccionToEditState.set(transaccion);
  }

  clearTransaccionToEdit() {
    this.transaccionToEditState.set(null);
  }

  exportarExcel() {
    return this.http.get(`${this.url}/exportar`, {
      responseType: 'blob'
    }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte-transacciones.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

}
