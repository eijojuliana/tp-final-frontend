import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { PedidoService } from '../../../services/pedido-service';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-pedidos-list',
  standalone: true,
  imports: [RouterLink, DatePipe, CommonModule, CurrencyPipe],
  templateUrl: './pedidos-list.html',
  styleUrl: './pedidos-list.css',
})
export class PedidosList implements OnInit {
  pedidoService = inject(PedidoService);
  pedidos = this.pedidoService.pedidos;
  router = inject(Router);

  filtro = signal('');
  tipoFiltro = signal<'VENTA' | 'COMPRA' | ''>('');
  atributo = signal<string>('');
  orden = signal<'asc' | 'desc' | ''>('');

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
    this.rangoSeleccionado.set('personalizado');
  }

  pedidosFiltrados = computed(() => {
    const attr = this.atributo();
    const ord = this.orden();
    const tipo = this.tipoFiltro();
    const hoy = new Date().getTime();
    const finHoy = new Date().setHours(23, 59, 59, 999);

    const getValue = (p: any) => {
      if (attr === 'transaccionId') return p.transaccion.transaccion_id;
      if (attr === 'fecha') return new Date(p.transaccion.fecha).getTime();
      if (attr === 'total') return p.transaccion.monto;
      return p[attr as keyof typeof p];
    };

    return this.pedidos()
      .filter(p => (tipo ? p.tipo === tipo : true))
      .filter(p => {
        const fechaPed = new Date(p.transaccion.fecha).getTime();
        switch (this.rangoSeleccionado()) {
          case 'hoy': return fechaPed >= new Date().setHours(0, 0, 0, 0);
          case 'ayer':
            const ayer = new Date(); ayer.setDate(ayer.getDate() - 1);
            return fechaPed >= ayer.setHours(0,0,0,0) && fechaPed <= ayer.setHours(23,59,59,999);
          case 'semana':
            const haceUnaSemana = new Date().setDate(new Date().getDate() - 7);
            return fechaPed >= haceUnaSemana;
          case 'mes':
            const haceUnMes = new Date(); haceUnMes.setMonth(haceUnMes.getMonth() - 1);
            return fechaPed >= haceUnMes.getTime();
          case 'personalizado':
            if (!this.fechaInicioManual() || !this.fechaFinManual()) return true;
            return fechaPed >= new Date(this.fechaInicioManual() + 'T00:00:00').getTime() &&
                   fechaPed <= new Date(this.fechaFinManual() + 'T23:59:59').getTime();
          default: return true;
        }
      })
      .sort((a, b) => {
        if (!ord || !attr) return 0;
        const A = getValue(a);
        const B = getValue(b);
        return ord === 'asc' ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
      });
  });

  onTipoChange(event: Event) {
    this.tipoFiltro.set((event.target as HTMLSelectElement).value as 'VENTA' | 'COMPRA' | '');
  }

  deletePedido(id: number) {
    if (confirm('¿Desea eliminar este pedido?')) {
      this.pedidoService.delete(id).subscribe();
    }
  }

  updatePedido(pedido: any) {
    this.pedidoService.selectPedidoToEdit(pedido);
    this.router.navigate(['/menu/pedidos/form']);
  }
}
