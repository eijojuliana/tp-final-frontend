import { Component, computed, signal, OnInit } from '@angular/core';
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
  atributo = signal<string>('fecha');
  orden = signal<string>('desc');
  filtro = signal<string>('');

  historialFiltrado = computed(() => {
    const data = this.historial();
    const f = this.filtro().toLowerCase().trim();
    const attr = this.atributo();
    const ord = this.orden();

    let result = data;
    if (f) {
      result = result.filter(h =>
        String(h.historialPersonaId).includes(f) ||
        String(h.personaId).includes(f) ||
        String(h.nombre).toLowerCase().includes(f) ||
        String(h.apellido).toLowerCase().includes(f) ||
        String(h.accion).toLowerCase().includes(f) ||
        String(h.fechaEvento).toLowerCase().includes(f)
      );
    }

    result = result.slice().sort((a: any, b: any) => {
      let cmp = 0;
      switch (attr) {
        case 'personaId': cmp = (a.personaId ?? 0) - (b.personaId ?? 0); break;
        case 'usuario': cmp = String(a.usuario).localeCompare(String(b.usuario)); break;
        case 'accion': cmp = String(a.accion).localeCompare(String(b.accion)); break;
        default: cmp = new Date(a.fechaEvento).getTime() - new Date(b.fechaEvento).getTime(); break;
      }
      return ord === 'desc' ? -cmp : cmp;
    });

    return result;
  });

  constructor(private historialService: HistorialPersonaService) {}

  ngOnInit(): void {
    this.historialService
      .getHistorial('fecha', 'desc', '')
      .subscribe({
        next: (data) => this.historial.set(data),
        error: (err) => console.error("Error", err)
      });
  }
}
