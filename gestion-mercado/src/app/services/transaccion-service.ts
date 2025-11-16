import { Injectable, signal } from '@angular/core';
import { Transaccion } from '../models/transaccion.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TransaccionService {
  private url = "http://localhost:8080/api/transacciones"

  private transaccionesState = signal<Transaccion[]>([]);
  public transacciones = this.transaccionesState.asReadonly();

  constructor(private http:HttpClient){
    this.load();
  }

  load(){
    this.http.get<Transaccion[]>(this.url).subscribe(
      data => this.transaccionesState.set(data)
    );
  }

}
