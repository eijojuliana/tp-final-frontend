import { Component, signal, OnInit } from '@angular/core';
import { HistorialPersonaService } from './historial-persona.service';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historial-persona-list',
  templateUrl: './historial-persona-list.html',
  styleUrl: './historial-persona-list.css',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, RouterLink]
})
export class HistorialPersonaListComponent implements OnInit {

  historial = signal<any[]>([]);
  atributo = signal<string>('');
  orden = signal<string>('');
  filtro = signal<string>('');

  constructor(private historialService: HistorialPersonaService) {}

  ngOnInit(): void {
    this.atributo.set('fecha');
    this.orden.set('desc');
    this.cargar();
  }

  cargar(): void {
    this.historialService
      .getHistorial(this.atributo(), this.orden(), this.filtro())
      .subscribe({
        next: (data) => this.historial.set(data),
        error: (err) => console.error("Error", err)
      });
  }
}
