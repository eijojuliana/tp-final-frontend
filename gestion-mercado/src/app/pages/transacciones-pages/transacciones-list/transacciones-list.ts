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

   tipoFiltro = signal< 'EFECTIVO' | 'DEBITO' | ''>('');

  transaccionesFiltrados = computed(() => {
    const tipo = this.tipoFiltro();
    return this.transacciones().filter((p) => (tipo ? p.tipo === tipo : true));
  });

  onTipoChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'EFECTIVO' | 'DEBITO' | '';
    this.tipoFiltro.set(value);
  }
}
