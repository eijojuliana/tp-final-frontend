import { Component, computed, signal, OnInit } from '@angular/core';
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
        String(h.historialTiendaId).includes(f) ||
        String(h.tiendaId).includes(f) ||
        String(h.nombreFantasia).toLowerCase().includes(f) ||
        String(h.accion).toLowerCase().includes(f) ||
        String(h.fechaEvento).toLowerCase().includes(f)
      );
    }

    result = result.slice().sort((a: any, b: any) => {
      let cmp = 0;
      switch (attr) {
        case 'tiendaId': cmp = (a.tiendaId ?? 0) - (b.tiendaId ?? 0); break;
        case 'accion': cmp = String(a.accion).localeCompare(String(b.accion)); break;
        default: cmp = new Date(a.fechaEvento).getTime() - new Date(b.fechaEvento).getTime(); break;
      }
      return ord === 'desc' ? -cmp : cmp;
    });

    return result;
  });

  constructor(private historialService: HistorialTiendaService) {}

  ngOnInit(): void {
    this.historialService.getHistorial('fecha', 'desc', '')
      .subscribe({ next: (data) => this.historial.set(data), error: (err) => console.error("Error", err) });
  }
}
