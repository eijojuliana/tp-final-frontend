import { Component, inject, Input, signal, SimpleChanges } from '@angular/core';
import { DetallePedidoService } from '../../services/detallePedido-service';
import { DetallePedido } from '../../models/detallePedido.model';
import { FormsModule } from '@angular/forms';
import { Pedido } from '../../models/pedido.model';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-detalles-pedido',
  imports: [FormsModule],
  templateUrl: './detalles-pedido.html',
  styleUrl: './detalles-pedido.css',
})
export class DetallesPedido {
  @Input({ required: true }) pedido!: Pedido;// Recibe el pedido

  //Para producto
  private productService=inject(ProductService);
  public productos=this.productService.productos;

  private detallePedidoService = inject(DetallePedidoService);

  // Signal de la lista de detalles
  detallesPedido = signal<DetallePedido[]>([]);

  ngOnChanges(changes: SimpleChanges){
    if (changes['pedido'] && this.pedido?.detalles) {
      this.detallesPedido.set(this.pedido.detalles); // Inicializamos el signal con los detalles que vienen del input
    }
  }

  // Objeto para el formulario
  nuevoDetalle: { productoId: number | undefined, cantidad: number | undefined, costoUnitario: number | undefined } = {
    productoId: undefined,
    cantidad: undefined,
    costoUnitario: undefined
  };

  ngOnInit(){
    if (this.pedido && (!this.pedido.detalles || this.pedido.detalles.length === 0)) {
      this.obtenerDetallesDelPedido(this.pedido.pedidoId);
    }
  }

  agregarDetalle(){
    if (this.nuevoDetalle.productoId === undefined || this.nuevoDetalle.cantidad === undefined) {
      console.error('Producto ID y Cantidad son requeridos.');
      return;
    }

    const dto = {
      productoId: this.nuevoDetalle.productoId,
      cantidad: this.nuevoDetalle.cantidad,
      costoUnitarioCompra: this.nuevoDetalle.costoUnitario
    };

    this.detallePedidoService.agregarDetalle(this.pedido.pedidoId, dto).subscribe( () => {
        console.log('Detalle de pedido agregado:');
        this.obtenerDetallesDelPedido(this.pedido.pedidoId);
        this.nuevoDetalle = { productoId: undefined, cantidad: undefined, costoUnitario: undefined };
      }
    );
  }

  obtenerDetallesDelPedido(pedidoId: number){
    this.detallePedidoService.getDetallesByPedidoId(pedidoId).subscribe(
      (detalles) => {
        this.detallesPedido.set(detalles); // Actualiza el signal
      }
    );
  }
  eliminarDetalle(detalleId: number){
    this.detallePedidoService.eliminarDetalle(detalleId).subscribe( () => {
        console.log('Detalle de pedido eliminado: ' + detalleId);
        // Recarga la lista para reflejar el cambio
        this.obtenerDetallesDelPedido(this.pedido.pedidoId);
      }
    );
  }
}
