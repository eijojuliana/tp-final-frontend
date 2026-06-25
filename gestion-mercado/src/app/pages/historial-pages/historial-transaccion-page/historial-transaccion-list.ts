import { Component, computed, signal, OnInit } from '@angular/core';
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
        String(h.historialTransaccionId).includes(f) ||
        String(h.transaccionId).includes(f) ||
        String(h.accion).toLowerCase().includes(f) ||
        String(h.fechaEvento).toLowerCase().includes(f)
      );
    }

    result = result.slice().sort((a: any, b: any) => {
      let cmp = 0;
      switch (attr) {
        case 'transaccionId': cmp = (a.transaccionId ?? 0) - (b.transaccionId ?? 0); break;
        case 'accion': cmp = String(a.accion).localeCompare(String(b.accion)); break;
        default: cmp = new Date(a.fechaEvento).getTime() - new Date(b.fechaEvento).getTime(); break;
      }
      return ord === 'desc' ? -cmp : cmp;
    });

    return result;
  });

  constructor(private historialService: HistorialTransaccionService) {}

  ngOnInit(): void {
    this.historialService.getHistorial('fecha', 'desc', '')
      .subscribe({ next: (data) => this.historial.set(data), error: (err) => console.error("Error", err) });
  }
}
