import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, Input, signal, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DetallePedidoService } from '../../services/detallePedido-service';
import { DetallePedido } from '../../models/detallePedido.model';
import { FormsModule } from '@angular/forms';
import { Pedido } from '../../models/pedido.model';
import { ProductService } from '../../services/product-service';
import { ToastService } from '../../services/toast.service';
import { BuscadorGenericoComponent } from '../buscador/buscador';
import { BuscadorItem } from '../buscador/buscador-item';

@Component({
  selector: 'app-detalles-pedido',
  imports: [FormsModule, BuscadorGenericoComponent, CurrencyPipe],
  templateUrl: './detalles-pedido.html',
  styleUrl: './detalles-pedido.css',
})
export class DetallesPedido {
  @Input({ required: true }) pedido!: Pedido;
  @Input() showInfoCard: boolean = true;

  private router = inject(Router);
  private productService = inject(ProductService);
  public productos = this.productService.productos;

  private detallePedidoService = inject(DetallePedidoService);
  private toast = inject(ToastService);

  detallesPedido = signal<DetallePedido[]>([]);

  total = computed(() => {
    return this.detallesPedido().reduce((acc, curr) => acc + curr.subtotal, 0);
  });

  detalleEnEdicion = signal<DetallePedido | null>(null);

  nuevoDetalle: { productoId: number | undefined; cantidad: number | undefined; costoUnitario: number | undefined } = {
    productoId: undefined,
    cantidad: undefined,
    costoUnitario: undefined,
  };

  productosMapeados = computed<BuscadorItem[]>(() => {
    return this.productos().map(p => ({
      id: p.producto_id,
      textoPrincipal: p.nombre,
      subtexto: `Categoría: ${p.categoria}`,
      imagenUrl: p.url || 'assets/images/default-product.png'
    }));
  });

  destinatarioLabel = computed(() => {
    const pedido = this.pedido;
    if (!pedido?.transaccion) return '-';
    const trans = pedido.transaccion;
    if (pedido.tipo === 'COMPRA') {
      return `Proveedor #${trans.destino_id || '-'}`;
    }
    return `Cliente #${trans.origen_id || '-'}`;
  });

  getProductImage(productoId: number): string {
    const prod = this.productos().find(p => p.producto_id === productoId);
    return prod?.url || 'assets/images/default-product.png';
  }

  irAProducto() {
    this.router.navigate(['/menu/productos/form']);
  }

  public alSeleccionarProducto(id: number | string): void {
    this.nuevoDetalle.productoId = id as number;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pedido'] && this.pedido) {
      this.obtenerDetallesDelPedido(this.pedido.pedidoId);
    }
  }

  agregarDetalle() {
    if (!this.nuevoDetalle.productoId || !this.nuevoDetalle.cantidad) {
      this.toast.error('Debe seleccionar un producto y especificar una cantidad');
      return;
    }

    const dto: any = {
      productoId: this.nuevoDetalle.productoId,
      cantidad: this.nuevoDetalle.cantidad,
      costoUnitario: this.nuevoDetalle.costoUnitario ?? 0,
    };

    const edicion = this.detalleEnEdicion();
    if (edicion) {
      this.detallePedidoService.update(edicion.detallePedidoId, dto).subscribe(() => {
        this.obtenerDetallesDelPedido(this.pedido.pedidoId);
        this.cancelarEdicionDetalle();
      });
    } else {
      this.detallePedidoService.post(this.pedido.pedidoId, dto).subscribe(() => {
        this.obtenerDetallesDelPedido(this.pedido.pedidoId);
        this.nuevoDetalle = { productoId: undefined, cantidad: undefined, costoUnitario: undefined };
      });
    }
  }

  obtenerDetallesDelPedido(pedidoId: number){
    this.detallePedidoService.load(pedidoId).subscribe(
      (detalles) => {
        this.detallesPedido.set(detalles);
      }
    );
  }

  eliminarDetalle(detalleId: number){
    this.detallePedidoService.delete(detalleId).subscribe(() => {
        this.obtenerDetallesDelPedido(this.pedido.pedidoId);
      }
    );
  }

  incrementarCantidad(detalle: DetallePedido) {
    const nuevaCantidad = detalle.cantidad + 1;
    const dto: any = {
      productoId: detalle.producto_id,
      cantidad: nuevaCantidad,
      costoUnitario: detalle.costoUnitario ?? 0,
    };
    this.detallePedidoService.update(detalle.detallePedidoId, dto).subscribe(() => {
      this.obtenerDetallesDelPedido(this.pedido.pedidoId);
    });
  }

  decrementarCantidad(detalle: DetallePedido) {
    if (detalle.cantidad <= 1) return;
    const nuevaCantidad = detalle.cantidad - 1;
    const dto: any = {
      productoId: detalle.producto_id,
      cantidad: nuevaCantidad,
      costoUnitario: detalle.costoUnitario ?? 0,
    };
    this.detallePedidoService.update(detalle.detallePedidoId, dto).subscribe(() => {
      this.obtenerDetallesDelPedido(this.pedido.pedidoId);
    });
  }

  editarDetalle(detalle: DetallePedido) {
    this.detalleEnEdicion.set(detalle);
    this.nuevoDetalle = {
      productoId: detalle.producto_id,
      cantidad: detalle.cantidad,
      costoUnitario: detalle.costoUnitario,
    };
  }

  cancelarEdicionDetalle() {
    this.detalleEnEdicion.set(null);
    this.nuevoDetalle = { productoId: undefined, cantidad: undefined, costoUnitario: undefined };
  }
}
