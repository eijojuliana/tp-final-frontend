import { Component, signal, OnInit } from '@angular/core';
import { HistorialDuenioService } from './historial-duenio.service';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historial-duenio-list',
  templateUrl: './historial-duenio-list.html',
  styleUrl: './historial-duenio-list.css',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, RouterLink]
})
export class HistorialDuenioListComponent implements OnInit {
  historial = signal<any[]>([]);
  atributo = signal<string>('');
  orden = signal<string>('');
  filtro = signal<string>('');

  constructor(private historialService: HistorialDuenioService) {}

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
