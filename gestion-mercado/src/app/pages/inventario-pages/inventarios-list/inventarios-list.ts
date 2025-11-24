import { Producto } from './../../../models/producto.model';
import { Component, computed, inject, signal } from '@angular/core';
import { InventarioService } from '../../../services/inventario-service';
import { Router} from '@angular/router';
import { Inventario } from '../../../models/inventario.model';
import { ToastService } from '../../../services/toast.service';
import { ProductService } from '../../../services/product-service';


@Component({
  selector: 'app-inventarios-list',
  imports: [],
  templateUrl: './inventarios-list.html',
  styleUrl: './inventarios-list.css',
})
export class InventariosList {
  private inventarioService = inject(InventarioService);
  private router = inject(Router);
  inventarios = this.inventarioService.inventarios;
  private toast = inject(ToastService);

  private productService = inject(ProductService);
  productos = this.productService.productos;

  getNombreProducto(productoId: number): string {
    const lista = this.productos();          // signal → llamarla como función
    if (!lista) return `ID ${productoId}`;

    const prod = lista.find(p => p.producto_id === productoId);
    return prod ? prod.nombre : `ID ${productoId}`;
  }



  filtro = signal('');
  atributo = signal<'inventario_id' | 'cantidad' | 'producto_id' | 'stockMin' | 'precioVenta' | 'costoAdquisicion'>('inventario_id');
  orden = signal<'asc' | 'desc'>('asc');

  inventariosFiltrados = computed(() => {
    const filtro = this.filtro();
    const attr = this.atributo();
    const ord = this.orden();

    return this.inventarios()
      .filter(i => filtro ? String((i as any)[attr]).toLowerCase().includes(filtro.toLowerCase()) : true)
      .sort((a, b) => {
        const A = (a as any)[attr];
        const B = (b as any)[attr];

        if (typeof A === 'number' && typeof B === 'number') {
          return ord === 'asc' ? A - B : B - A;
        }

        return ord === 'asc'
          ? String(A).localeCompare(String(B))
          : String(B).localeCompare(String(A));
      });
  });

  deleteInventario(id:number) {
    if(confirm("¿Desea eliminar?")) {
      this.inventarioService.delete(id).subscribe({
        next: () => {
          this.toast.success("Inventario eliminado correctamente");
          console.log(`Inventario de ID: ${id} eliminado.`);
        }
      });
    }
  }

  updateInventario(inventario:Inventario) {
    this.inventarioService.seleccionarInventarioToEdit(inventario);
    this.router.navigate(['/menu/inventarios/form']);
  }
}
