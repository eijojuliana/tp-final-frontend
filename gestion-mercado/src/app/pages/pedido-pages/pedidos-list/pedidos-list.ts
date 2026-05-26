import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { PedidoService } from '../../../services/pedido-service';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-pedidos-list',
  standalone: true,
  imports: [RouterLink, DatePipe, CommonModule],
  templateUrl: './pedidos-list.html',
  styleUrl: './pedidos-list.css',
})
export class PedidosList implements OnInit {
  pedidoService = inject(PedidoService);
  pedidos = this.pedidoService.pedidos;
  router = inject(Router);

  filtro = signal('');
  tipoFiltro = signal<'VENTA' | 'COMPRA' | ''>('');
  atributo = signal<'pedidoId' | 'transaccionId' | 'tipo' | 'fecha' | 'tipoPedido' | 'total'>('pedidoId');
  orden = signal<'asc' | 'desc'>('asc');

  rangoSeleccionado = signal<string>('todo');
  fechaInicioManual = signal<string>('');
  fechaFinManual = signal<string>('');

  ngOnInit() {
    this.seleccionarRango('todo');
  }

  seleccionarRango(rango: string) {
    this.rangoSeleccionado.set(rango);
  }

  cambioFechaManual(inicio: string, fin: string) {
    this.fechaInicioManual.set(inicio);
    this.fechaFinManual.set(fin);
    if (inicio && fin) {
      this.rangoSeleccionado.set('personalizado');
    }
  }

  pedidosFiltrados = computed(() => {
    const filtro = this.filtro().toLowerCase();
    const attr = this.atributo();
    const ord = this.orden();
    const tipo = this.tipoFiltro();
    const rango = this.rangoSeleccionado();

    const hoy = new Date();
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()).getTime();
    const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999).getTime();

    const getValue = (p: any) => {
      switch(attr) {
        case 'transaccionId': return p.transaccion.transaccion_id;
        case 'tipo': return p.transaccion.tipo;
        case 'fecha': return p.transaccion.fecha;
        case 'total': return p.transaccion.monto;
        case 'tipoPedido': return p.tipo;
        default: return p[attr];
      }
    };

    return this.pedidos()
      .filter(p => (tipo ? p.tipo === tipo : true))
      .filter(p => String(getValue(p)).toLowerCase().includes(filtro))
      .filter(p => {
        if (rango === 'todo') return true;

        const fechaPed = new Date(p.transaccion.fecha).getTime();

        switch (rango) {
          case 'hoy':
            return fechaPed >= inicioHoy && fechaPed <= finHoy;

          case 'ayer': {
            const inicioAyer = inicioHoy - 24 * 60 * 60 * 1000;
            const finAyer = finHoy - 24 * 60 * 60 * 1000;
            return fechaPed >= inicioAyer && fechaPed <= finAyer;
          }

          case 'semana': {
            const haceUnaSemana = inicioHoy - 7 * 24 * 60 * 60 * 1000;
            return fechaPed >= haceUnaSemana && fechaPed <= finHoy;
          }

          case 'mes': {
            const haceUnMes = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate()).getTime();
            return fechaPed >= haceUnMes && fechaPed <= finHoy;
          }

          case 'personalizado': {
            if (!this.fechaInicioManual() || !this.fechaFinManual()) return true;
            const checkInicio = new Date(this.fechaInicioManual() + 'T00:00:00').getTime();
            const checkFin = new Date(this.fechaFinManual() + 'T23:59:59').getTime();
            return fechaPed >= checkInicio && fechaPed <= checkFin;
          }

          default:
            return true;
        }
      })
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
      this.pedidoService.delete(id).subscribe();
    }
  }

  updatePedido(pedido: any) {
    this.pedidoService.selectPedidoToEdit(pedido);
    this.router.navigate(['/menu/pedidos/form']);
  }
}
