import { Component, computed, inject, Input, signal, SimpleChanges } from '@angular/core';
import { DetallePedidoService } from '../../services/detallePedido-service';
import { DetallePedido } from '../../models/detallePedido.model';
import { FormsModule } from '@angular/forms';
import { Pedido } from '../../models/pedido.model';
import { ProductService } from '../../services/product-service';
import { ToastService } from '../../services/toast.service';

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
  private toast = inject(ToastService);

  // Signal de la lista de detalles
  detallesPedido = signal<DetallePedido[]>([]);

  //Variable para el total
  total = computed(() => {
    return this.detallesPedido().reduce((acc, curr) => acc + curr.subtotal, 0);
  });

  //Signal para editar
  detalleEnEdicion = signal<DetallePedido | null>(null);

  // Objeto para el formulario
  nuevoDetalle: { productoId: number | undefined, cantidad: number | undefined, costoUnitario: number | undefined } = {
    productoId: undefined,
    cantidad: undefined,
    costoUnitario: undefined
  };

  ngOnInit(){
    if (this.pedido && this.pedido.pedidoId) {
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

    if (this.detalleEnEdicion()) {
      // MODO EDICIÓN
      const idDetalle = this.detalleEnEdicion()!.detallePedidoId;
      this.detallePedidoService.update(idDetalle, dto).subscribe(() => {
        console.log('Detalle actualizado');
        this.toast.success("Detalle actualizado correctamente");
        this.obtenerDetallesDelPedido(this.pedido.pedidoId);
        this.cancelarEdicionDetalle();
      });
    } else {
      // MODO CREACIÓN
      this.detallePedidoService.agregarDetalle(this.pedido.pedidoId, dto).subscribe(() => {
        console.log('Detalle agregado');
        this.toast.success("Detalle agregado correctamente");
        this.obtenerDetallesDelPedido(this.pedido.pedidoId);
        this.nuevoDetalle = { productoId: undefined, cantidad: undefined, costoUnitario: undefined };
      });
    }
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

  editarDetalle(detalle: DetallePedido) {
    this.detalleEnEdicion.set(detalle);
    this.nuevoDetalle = {
      productoId: detalle.producto_id,
      cantidad: detalle.cantidad,
      costoUnitario: detalle.costoUnitarioCompra // Si es compra
    };
  }

  cancelarEdicionDetalle() {
    this.detalleEnEdicion.set(null);
    this.nuevoDetalle = { productoId: undefined, cantidad: undefined, costoUnitario: undefined };
  }
}
