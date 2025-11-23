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

  filtro = signal('');
  tipoFiltro = signal<'VENTA' | 'COMPRA' | ''>('');
  atributo = signal<'pedidoId' | 'transaccionId' | 'tipo' | 'fecha' | 'tipoPedido' | 'total'>('pedidoId');
  orden = signal<'asc' | 'desc'>('asc');

  pedidosFiltrados = computed(() => {
    const filtro = this.filtro().toLowerCase();
    const attr = this.atributo();
    const ord = this.orden();
    const tipo = this.tipoFiltro();

    const getValue = (p: any) => {
      switch(attr) {
        case 'transaccionId': return p.transaccion.transaccion_id;
        case 'tipo': return p.transaccion.tipo;
        case 'fecha': return p.transaccion.fecha;
        case 'total': return p.transaccion.monto;
        case 'tipoPedido': return p.tipo;
        default: return p[attr];
      }
    }

    return this.pedidos()
      .filter(p => (tipo ? p.tipo === tipo : true)) //eto permite que sea compatible con el onTipoChange
      .filter(p => String(getValue(p)).toLowerCase().includes(filtro))
      .sort((a, b) => {
        const A = getValue(a);
        const B = getValue(b);

        if (typeof A === 'number' && typeof B === 'number') {
          return ord === 'asc' ? A - B : B - A;
        }

        return ord === 'asc'
          ? String(A).localeCompare(String(B))
          : String(B).localeCompare(String(A));
      });
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

  updatePedido(pedido: any) {
    this.pedidoService.selectPedidoToEdit(pedido);
    this.router.navigate(['/menu/pedidos/form', pedido.pedidoId]);
  }
}
