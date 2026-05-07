import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Cliente, NewCliente } from '../models/cliente.model';
import { Observable, tap } from 'rxjs';
import { environment } from './ip';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private url= environment.apiBaseUrl + "/clientes";
  private state=signal<Cliente[]>([]);
  public clientes=this.state.asReadonly();

  private clienteToEditState=signal<Cliente | null> (null);
  public clienteToEdit=this.clienteToEditState.asReadonly();

  constructor(private http:HttpClient){
    this.load()
  }

  load(){
    this.http.get<Cliente[]>(this.url).subscribe(
      data => this.state.set(data)
    );
  }

  post(cliente:NewCliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.url,cliente).pipe(
      tap( () => this.load() )
    );
  }

  delete(id:number) : Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.url}/${id}`).pipe(
      tap(
        () => this.state.update(currentCliente =>
          currentCliente.filter(nuevoCliente => nuevoCliente.clienteId!=id)
        )
      )
    );
  }

  update(cliente:Cliente): Observable<Cliente>{
    return this.http.put<Cliente>(`${this.url}/${cliente.clienteId}`,cliente).pipe(
      tap( () => this.load() )
    );
  }

  selectClienteToEdit(cliente:Cliente){
    this.clienteToEditState.set(cliente);
  }

  clearClienteToEdit(){
    this.clienteToEditState.set(null);
  }

  exportarExcel() {
    return this.http.get(`${this.url}/exportar`, {
      responseType: 'blob'
    }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte-personas.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}



