import { Component, inject, signal } from '@angular/core';
import { TiendaService } from '../../../services/tienda-service';
import { Router } from '@angular/router';
import { Tienda } from '../../../models/tienda.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-tiendas-list',
  imports: [],
  templateUrl: './tiendas-list.html',
  styleUrl: './tiendas-list.css',
})
export class TiendasList {

  private tiendaService = inject(TiendaService);
  public tienda = this.tiendaService.tiendas;
  private toast = inject(ToastService);

  deleteTienda(id:number) {
    if(confirm("¿Desea eliminar?")) {
      this.tiendaService.delete(id).subscribe({
        next: () => {
          this.toast.success("Tienda eliminada correctamente");
          console.log("Tienda Eliminada");
        }
      });
    }
  }

  updateTienda(tienda:Tienda) {
    this.tiendaService.selectTiendaToEdit(tienda);
  }
}
