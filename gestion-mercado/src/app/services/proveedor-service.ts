import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Proveedor, NewProveedor } from '../models/proveedor.model';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  private url = "http://localhost:8080/api/proveedores"

  private proveedorState = signal<Proveedor[]>([]);
  public proveedores = this.proveedorState.asReadonly();

  private proveedorToEditState = signal<Proveedor | null>(null);
  public proveedorToEdit = this.proveedorToEditState.asReadonly();

  constructor(private http: HttpClient) { this.load(); }

  load() {
    this.http.get<Proveedor[]>(this.url).subscribe(data =>
      this.proveedorState.set(data)
    )
  }

  post(proveedor: NewProveedor):Observable<Proveedor> {
    return this.http.post<Proveedor>(this.url, proveedor).pipe(
      tap( () => this.load() )
    );
  }

  delete(id:number):Observable<Proveedor> {
    return this.http.delete<Proveedor>(`${this.url}/${id}`).pipe(
      tap(() => {
        this.proveedorState.update(currentProveedors =>
          currentProveedors.filter(proveedor => proveedor.proveedorId !== id)
        )
      })
    );
  }

  update(proveedorToUpdate:Proveedor):Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.url}/${proveedorToUpdate.proveedorId}`, proveedorToUpdate).pipe(
      tap( () => this.load() )
    );
  }

  selectProveedorToEdit(proveedor:Proveedor) {
    this.proveedorToEditState.set(proveedor);
  }

  clearProveedorToEdit() {
    this.proveedorToEditState.set(null)
  }
}
