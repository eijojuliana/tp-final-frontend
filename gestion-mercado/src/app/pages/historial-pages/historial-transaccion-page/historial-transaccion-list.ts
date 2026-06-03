import { Component, signal, OnInit } from '@angular/core';
import { HistorialTransaccionService } from './historial-transaccion.service';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historial-transaccion-list',
  templateUrl: './historial-transaccion-list.html',
  styleUrl: './historial-transaccion-list.css',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, RouterLink]
})
export class HistorialTransaccionListComponent implements OnInit {
  historial = signal<any[]>([]);
  atributo = signal<string>('');
  orden = signal<string>('');
  filtro = signal<string>('');

  constructor(private historialService: HistorialTransaccionService) {}

  ngOnInit(): void {
    this.atributo.set('fecha');
    this.orden.set('desc');
    this.cargar();
  }

  cargar(): void {
    this.historialService.getHistorial(this.atributo(), this.orden(), this.filtro())
      .subscribe({ next: (data) => this.historial.set(data), error: (err) => console.error("Error", err) });
  }
}
