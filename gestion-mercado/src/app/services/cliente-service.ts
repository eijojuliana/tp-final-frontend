import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Cliente, NewCliente } from '../models/cliente.model';
import { Observable, tap } from 'rxjs';
import { environment } from './ip';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiurls= environment.apiBaseUrl + "/clientes";
  private state=signal<Cliente[]>([]);
  public clientes=this.state.asReadonly();

  private clienteToEditState=signal<Cliente | null> (null);
  public clienteToEdit=this.clienteToEditState.asReadonly();

  constructor(private httpClient:HttpClient){
    this.load()
  }

  load(){
    this.httpClient.get<Cliente[]>(this.apiurls).subscribe(
      data => this.state.set(data)
    );
  }

  post(cliente:NewCliente): Observable<Cliente>{
    return this.httpClient.post<Cliente>(this.apiurls,cliente).pipe(
      tap( () => this.load() )
    );
  }

  delete(id:number) : Observable<Cliente>{
    return this.httpClient.delete<Cliente>(`${this.apiurls}/${id}`).pipe(
      tap(
        () => this.state.update(currentCliente =>
          currentCliente.filter(nuevoCliente => nuevoCliente.clienteId!=id)
        )
      )
    );
  }

  update(cliente:Cliente): Observable<Cliente>{
    return this.httpClient.put<Cliente>(`${this.apiurls}/${cliente.clienteId}`,cliente).pipe(
      tap( () => this.load() )
    );
  }

  selectClienteToEdit(cliente:Cliente){
    this.clienteToEditState.set(cliente);
  }

  clearClienteToEdit(){
    this.clienteToEditState.set(null);
  }

}



