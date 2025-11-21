import { Component, computed, inject, signal } from '@angular/core';
import { PedidoService } from '../../../services/pedido-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-pedidos-list',
  imports: [RouterLink],
  templateUrl: './pedidos-list.html',
  styleUrl: './pedidos-list.css',
})
export class PedidosList {
  pedidoService = inject(PedidoService);
  pedidos = this.pedidoService.pedidos;
  router = inject(Router);

  tipoFiltro = signal<'VENTA' | 'COMPRA' | ''>('');

  pedidosFiltrados = computed(() => {
    const tipo = this.tipoFiltro();
    return this.pedidos().filter((p) => (tipo ? p.tipo === tipo : true));
  });
  
  onTipoChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'VENTA' | 'COMPRA' | '';
    this.tipoFiltro.set(value);
  }

  deletePedido(id: number) {
    if (confirm('¿Desea eliminar este pedidoo?')) {
      this.pedidoService.delete(id).subscribe(() => {
        console.log(`Pedido de id: ${id} Eliminado.`);
      });
    }
  }

  updatePedido(pedidoo: any) {
    this.pedidoService.selectPedidoToEdit(pedidoo);
    this.router.navigate(['/menu/pedidos/form']);
  }
}
