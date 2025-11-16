import { Component, inject } from '@angular/core';
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
}
