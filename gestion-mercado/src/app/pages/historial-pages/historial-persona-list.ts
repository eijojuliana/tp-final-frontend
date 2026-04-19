import { Component, signal, computed, OnInit } from '@angular/core';
import { HistorialPersonaService } from './historial-persona.service';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historial-persona-list',
  templateUrl: './historial-persona-list.html',
  styleUrl: './historial-persona-list.css',
  imports: [DatePipe, ReactiveFormsModule,RouterLink]
})
export class HistorialPersonaListComponent implements OnInit {

  historial = signal<any[]>([]);
  atributo = signal('fecha');
  orden = signal('desc');
  filtro = signal('');

  constructor(private historialService: HistorialPersonaService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.historialService
      .getHistorial(
        this.atributo(),
        this.orden(),
        this.filtro()
      )
      .subscribe(data => this.historial.set(data));
  }

  historialFiltrado = computed(() => this.historial());
}
