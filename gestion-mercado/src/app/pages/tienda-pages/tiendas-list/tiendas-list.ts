import { Component, inject } from '@angular/core';
import { TiendaService } from '../../../services/tienda-service';
import { Router } from '@angular/router';
import { Tienda } from '../../../models/tienda.model';

@Component({
  selector: 'app-tiendas-list',
  imports: [],
  templateUrl: './tiendas-list.html',
  styleUrl: './tiendas-list.css',
})
export class TiendasList {
  private tiendaService = inject(TiendaService);
  public tienda = this.tiendaService.tiendas;

  deleteTienda(id:number) {
    if(confirm("¿Desea eliminar?")) {
      this.tiendaService.delete(id).subscribe(() => {
        console.log("Tienda Eliminada");
      })
    }
  }

  updateTienda(tienda:Tienda) {
    this.tiendaService.seleccionarTiendaToEdit(tienda);
  }
}
