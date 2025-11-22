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
  atributo = signal<'nombre' | 'categoria'>('nombre');
  orden = signal<'asc' | 'desc'>('asc');

  productsFiltrados = computed(() => {
    const f = this.filtro().toLowerCase().trim();
    const attr = this.atributo();
    const order = this.orden();

    return this.products()
      .filter(p =>
        String((p as any)[attr]).toLowerCase().includes(f)
      )
      .sort((a, b) => {
        const A = String((a as any)[attr]).toLowerCase();
        const B = String((b as any)[attr]).toLowerCase();

        return order === 'asc'
          ? A.localeCompare(B)
          : B.localeCompare(A);
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
