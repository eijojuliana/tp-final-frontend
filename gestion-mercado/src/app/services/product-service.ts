import { Injectable, signal } from '@angular/core';
import { nuevoProducto, Producto } from '../models/producto.model';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from './ip';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = environment.apiBaseUrl + "/productos";

  private productState = signal<Producto[]>([]);
  public productos = this.productState.asReadonly();

  private productToEditState = signal<Producto | null>(null);
  public productToEdit = this.productToEditState.asReadonly();

  constructor(private http: HttpClient) { this.load(); }

  load() {
    this.http.get<Producto[]>(this.url).subscribe(data =>
      this.productState.set(data)
    )
  }

  post(product: nuevoProducto):Observable<Producto> {
    return this.http.post<Producto>(this.url, product).pipe(
      tap( () => this.load() )
    );
  }

  delete(id:number):Observable<Producto> {
    return this.http.delete<Producto>(`${this.url}/${id}`).pipe(
      tap(() => {
        this.productState.update(currentProducts =>
          currentProducts.filter(product => product.producto_id !== id)
        )
      })
    );
  }

  update(productToUpdate:Producto):Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/${productToUpdate.producto_id}`, productToUpdate).pipe(
      tap( () => this.load() )
    );
  }

  selectProductToEdit(producto:Producto) {
    this.productToEditState.set(producto);
  }

  clearProductToEdit() {
    this.productToEditState.set(null)
  }
}
