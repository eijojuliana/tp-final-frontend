import { Injectable, signal } from '@angular/core';
import { nuevoProducto, Producto } from '../models/producto.model';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = "http://localhost:8080/api/productos"

  private productState = signal<Producto[]>([]);
  public productos = this.productState.asReadonly();

  private productToEditState = signal<Producto | null>(null);
  public productToEdit = this.productToEditState.asReadonly();

  constructor(private http: HttpClient) { this.load(); }

  load() {
    this.http.get<Producto[]>(this.url).subscribe(data => {
      this.productState.set(data);
    })
  }

  post(product: nuevoProducto):Observable<Producto> {
    return this.http.post<Producto>(this.url, product).pipe(
      tap(nuevoProducto => {
        this.productState.update(currentProducts => [...currentProducts, nuevoProducto]);
      })
    )
  }

  delete(id:number):Observable<Producto> {
    return this.http.delete<Producto>(`${this.url}/${id}`).pipe(
      tap(() => {
        this.productState.update(currentProducts =>
          currentProducts.filter(product => product.producto_id !== id)
        )
      })
    )
  }

  update(productToUpdate:Producto):Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/${productToUpdate.producto_id}`, productToUpdate).pipe(
      tap(updatedProduct => {
        this.productState.update(currentProduct =>
          currentProduct.map(p =>
            p.producto_id === updatedProduct.producto_id ? updatedProduct : p)
        )
      })
    )
  }
}
