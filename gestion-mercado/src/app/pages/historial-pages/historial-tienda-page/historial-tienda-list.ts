import { Component, signal, OnInit } from '@angular/core';
import { HistorialTiendaService } from './historial-tienda.service';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historial-tienda-list',
  templateUrl: './historial-tienda-list.html',
  styleUrl: './historial-tienda-list.css',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, RouterLink]
})
export class HistorialTiendaListComponent implements OnInit {
  historial = signal<any[]>([]);
  atributo = signal<string>('');
  orden = signal<string>('');
  filtro = signal<string>('');

  constructor(private historialService: HistorialTiendaService) {}

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
