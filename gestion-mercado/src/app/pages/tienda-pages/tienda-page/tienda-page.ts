import { Component, inject, signal } from '@angular/core';
import { TiendaService } from '../../../services/tienda-service';
import { TiendasList } from "../tiendas-list/tiendas-list";
import { TiendasForm } from "../tiendas-form/tiendas-form";

@Component({
  selector: 'app-tienda-page',
  imports: [TiendasList, TiendasForm],
  templateUrl: './tienda-page.html',
  styleUrl: './tienda-page.css',
})
export class TiendaPage {
  private tiendaService = inject(TiendaService);
  public tiendaToEdit = this.tiendaService.tiendaToEdit;
  public tiendaCreada = signal(this.tiendaService.tiendas.length > 0);
}
