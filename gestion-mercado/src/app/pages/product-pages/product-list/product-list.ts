import { ProductService } from '../../../services/product-service';
import { Component, inject } from '@angular/core';
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
