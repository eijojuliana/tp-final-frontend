import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product-service';
import { InventarioService } from '../../../services/inventario-service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private productService = inject(ProductService);
  private inventarioService = inject(InventarioService);
  private toast = inject(ToastService);
  private router = inject(Router);

  productos = this.productService.productos;
  inventarios = this.inventarioService.inventarios;

  filtro = signal('');
  atributo = signal('');
  orden = signal<'asc' | 'desc' | ''>('');

  private _warned = false;

  constructor() {
    effect(() => {
      const invs = this.inventarios();
      const prods = this.productos();
      if (invs.length === 0 || prods.length === 0 || this._warned) return;

      const stockBajo = prods
        .map(p => {
          const inv = invs.find(i => i.producto_id === p.producto_id);
          return inv && inv.cantidad < inv.stockMin ? p.nombre : null;
        })
        .filter(Boolean);

      if (stockBajo.length > 0) {
        this._warned = true;
        setTimeout(() => {
          const msg = stockBajo.length === 1
              ? `Stock bajo: ${stockBajo[0]}`
              : `${stockBajo.length} productos con stock bajo`;
          this.toast.warning(msg, 6000);
        }, 500);
      }
    });
  }

  productosFiltrados = computed(() => {
    const filtro = this.filtro().toLowerCase().trim();
    const attr = this.atributo();
    const ord = this.orden();

    return this.productos()
      .filter(p => (filtro && attr ? String((p as any)[attr]).toLowerCase().includes(filtro) : true))
      .sort((a, b) => {
        if (!ord || !attr) return 0;
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

  productosConInventario = computed(() => {
    const invs = this.inventarios();
    return this.productosFiltrados().map(p => {
      const inv = invs.find(i => i.producto_id === p.producto_id);
      const bajo = inv !== null && inv !== undefined && inv.cantidad < inv.stockMin;
      return { ...p, inventario: inv, stockBajo: bajo };
    });
  });

  deleteProduct(producto: any) {
    if (!confirm('¿Desea eliminar este producto?')) return;

    const inv = producto.inventario;

    const deleteInv = () => {
      if (inv) {
        this.inventarioService.delete(inv.inventario_id).subscribe({
          next: () => this.doDeleteProduct(producto.producto_id),
          error: () => this.toast.error('No se pudo eliminar el inventario asociado'),
        });
      } else {
        this.doDeleteProduct(producto.producto_id);
      }
    };

    deleteInv();
  }

  private doDeleteProduct(id: number) {
    this.productService.delete(id).subscribe({
      next: () => this.toast.success('Producto eliminado correctamente'),
      error: () => this.toast.error('Error al eliminar el producto'),
    });
  }

  updateProduct(producto: any) {
    this.productService.selectProductToEdit(producto);
    this.router.navigate(['/menu/productos/form']);
  }

  exportarExcel() {
    this.productService.exportarExcel();
  }
}
