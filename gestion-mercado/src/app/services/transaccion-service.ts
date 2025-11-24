import { Injectable, signal } from '@angular/core';
import { Transaccion } from '../models/transaccion.model';
import { HttpClient } from '@angular/common/http';
import { environment } from './ip';

@Injectable({
  providedIn: 'root',
})
export class TransaccionService {
  private url = environment.apiBaseUrl + "/transacciones";

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
