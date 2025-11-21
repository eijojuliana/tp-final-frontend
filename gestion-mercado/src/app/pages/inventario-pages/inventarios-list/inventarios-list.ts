import { Component, computed, inject, signal } from '@angular/core';
import { InventarioService } from '../../../services/inventario-service';
import { Router, RouterLink } from '@angular/router';
import { Inventario } from '../../../models/inventario.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-inventarios-list',
  imports: [RouterLink],
  templateUrl: './inventarios-list.html',
  styleUrl: './inventarios-list.css',
})
export class InventariosList {
  private inventarioService = inject(InventarioService);
  private router = inject(Router);
  inventarios = this.inventarioService.inventarios;
  private toast = inject(ToastService);

  filtro = signal('');
  atributo = signal<'cantidad' | 'producto_id' | 'stockMin' | 'precioVenta' | 'costoAdquisición'>('cantidad');

  inventariosFiltrados = computed(() => {
    const f = this.filtro().toLowerCase().trim();
    const attr = this.atributo();

    return this.inventarios().filter(i => {
      return String((i as any)[attr]).toLowerCase().includes(f);
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
