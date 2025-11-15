import { Component, inject } from '@angular/core';
import { InventarioService } from '../../../services/inventario-service';
import { Router, RouterLink } from '@angular/router';
import { Inventario } from '../../../models/inventario.model';

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

  deleteInventario(id:number) {
    if(confirm("¿Desea eliminar?")) {
      this.inventarioService.delete(id).subscribe(() => {
        console.log(`Inventario de ID: ${id} eliminado.`);
      })
    }
  }

  updateInventario(inventario:Inventario) {
    this.inventarioService.seleccionarInventarioToEdit(inventario);
    this.router.navigate(['/menu/inventarios/form']);
  }
}
