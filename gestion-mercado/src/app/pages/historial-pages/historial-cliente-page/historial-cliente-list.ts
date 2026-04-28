import { Component, signal, computed, OnInit } from '@angular/core';
import { HistorialClienteService } from './historial-cliente.service';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historial-cliente-list',
  templateUrl: './historial-cliente-list.html',
  styleUrl: './historial-cliente-list.css',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, RouterLink]
})
export class HistorialClienteListComponent implements OnInit {
  historial = signal<any[]>([]);
  atributo = signal('fecha');
  orden = signal('desc');
  filtro = signal('');

  constructor(private historialService: HistorialClienteService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.historialService.getHistorial(this.atributo(), this.orden(), this.filtro())
      .subscribe(data => this.historial.set(data));
  }

  historialFiltrado = computed(() => this.historial());
}
