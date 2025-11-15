import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Cliente, NewCliente } from '../models/cliente.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiurls="http://localhost:8080/api/clientes";
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
    )
  }

  agregar(cliente:NewCliente): Observable<Cliente>{
    return this.httpClient.post<Cliente>(this.apiurls,cliente).pipe(
      tap(
        data => this.state.update(currentCliente => [...currentCliente,data])
      )
    )
  }

  eliminar(id:number) : Observable<Cliente>{
    return this.httpClient.delete<Cliente>(`${this.apiurls} / ${id}`).pipe(
      tap(
        () => this.state.update(currentCliente =>
          currentCliente.filter(nuevoCliente => nuevoCliente.clienteId!=id)
        )
      )
    )
  }

  modificar(cliente:Cliente): Observable<Cliente>{
    return this.httpClient.put<Cliente>(`${this.apiurls}/${cliente.clienteId}`,cliente).pipe(
      tap( clienteActualizado =>
       this.state.update(currentClientes => currentClientes.map(
        c => c.clienteId ===  clienteActualizado.clienteId ? clienteActualizado : c
       ))
      )
    )
  }

  selectClienteToEdit(cliente:Cliente){
    this.clienteToEditState.set(cliente);
  }

  clearClienteToEdit(){
    this.clienteToEditState.set(null);
  }

}



