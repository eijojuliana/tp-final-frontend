import { Component, computed, inject, signal } from '@angular/core';
import { TransaccionService } from '../../../services/transaccion-service';

@Component({
  selector: 'app-transacciones-list',
  imports: [],
  templateUrl: './transacciones-list.html',
  styleUrl: './transacciones-list.css',
})
export class TransaccionesList {
  private service = inject(TransaccionService);
  public transacciones = this.service.transacciones;

  tipoFiltro = signal<'EFECTIVO' | 'DEBITO' | ''>('');
  atributo = signal<'transaccion_id' | 'origen_id' | 'destino_id' | 'monto' | 'fecha'>('transaccion_id');
  orden = signal<'asc' | 'desc'>('asc');

  transaccionesFiltrados = computed(() => {
    const tipo = this.tipoFiltro();
    const attr = this.atributo();
    const ord = this.orden();

    return this.transacciones()
      .filter(p => (tipo ? p.tipo === tipo : true))
      .sort((a, b) => {
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

  onTipoChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'EFECTIVO' | 'DEBITO' | '';
    this.tipoFiltro.set(value);
  }
}
