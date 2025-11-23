import { ProductService } from '../../../services/product-service';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  productService = inject(ProductService);
  products = this.productService.productos;
  router = inject(Router);

  filtro = signal('');
  atributo = signal<'producto_id' | 'nombre' | 'categoria'>('producto_id');
  orden = signal<'asc' | 'desc'>('asc');

  productsFiltrados = computed(() => {
    const filtro = this.filtro().toLowerCase().trim();
    const attr = this.atributo();
    const ord = this.orden();

    return this.products()
      .filter(p => filtro ? String((p as any)[attr]).toLowerCase().includes(filtro) : true)
      .sort((a, b) => {
        const A = (a as any)[attr];
        const B = (b as any)[attr];

        if (typeof A === 'number' && typeof B === 'number') {
          return ord === 'asc' ? A - B : B - A;
        }

        return ord === 'asc'
          ? String(A).toLowerCase().localeCompare(String(B).toLowerCase())
          : String(B).toLowerCase().localeCompare(String(A).toLowerCase());
      });
  });

  deleteProduct(id:number) {
    if(confirm("¿Desea eliminar este producto?")) {
      this.productService.delete(id).subscribe(() => {
        console.log(`Producto de id: ${id} Eliminado.`);
      })
    }
  }

  updateProduct(producto: any) {
  this.productService.selectProductToEdit(producto);
  this.router.navigate(['/menu/productos/form']);
}
}
