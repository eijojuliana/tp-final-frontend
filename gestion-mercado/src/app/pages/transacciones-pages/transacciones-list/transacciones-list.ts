import { Component, computed, inject, signal } from '@angular/core';
import { TransaccionService } from '../../../services/transaccion-service';
import { Transaccion } from '../../../models/transaccion.model';
import { PedidoService } from '../../../services/pedido-service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-transacciones-list',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, RouterLink],
  templateUrl: './transacciones-list.html',
  styleUrl: './transacciones-list.css',
})
export class TransaccionesList {
  private service = inject(TransaccionService);
  public transacciones = this.service.transacciones;

  tipoFiltro = signal<'EFECTIVO' | 'TRANSFERENCIA' | ''>('');
  atributo = signal<string>('');
  orden = signal<'asc' | 'desc' | ''>('');

  transaccionesFiltrados = computed(() => {
    const tipo = this.tipoFiltro();
    const attr = this.atributo();
    const ord = this.orden();

    return this.transacciones()
      .filter(p => (tipo ? p.tipo === tipo : true))
      .sort((a, b) => {
        if (!ord || !attr) return 0;
        const A = (a as any)[attr];
        const B = (b as any)[attr];

        if (typeof A === 'number' && typeof B === 'number') {
          return ord === 'asc' ? A - B : B - A;
        }

        return ord === 'asc'
          ? String(A).toLowerCase().localeCompare(String(B).toLowerCase())
          : String(B).toLowerCase().localeCompare(String(A).toLowerCase());
      });
  });

  esEntrada(t: Transaccion): boolean {
    return t.tipo === 'EFECTIVO';
  }

  onTipoChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'EFECTIVO' | 'TRANSFERENCIA' | '';
    this.tipoFiltro.set(value);
  }

  exportarExcel() {
    this.service.exportarExcel();
  }
}
