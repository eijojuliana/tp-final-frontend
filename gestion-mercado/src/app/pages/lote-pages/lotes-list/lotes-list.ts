import { Router, RouterLink } from '@angular/router';
import { LoteService } from '../../../services/lote-service';
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Lote } from '../../../models/lote.model';
import { ToastService } from '../../../services/toast.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-lotes-list',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './lotes-list.html',
  styleUrl: './lotes-list.css',
})
export class LotesList implements OnInit {

  ngOnInit() {
    this.loteService.load();
  }

  private loteService = inject(LoteService);
  lotes = this.loteService.lotes;
  private router = inject(Router);
  private toast = inject(ToastService);

  filtro = signal('');
  atributo = signal<string>('');
  orden = signal<'asc' | 'desc' | ''>('');

  lotesFiltrados = computed(() => {
    const filtro = this.filtro().toLowerCase();
    const attr = this.atributo();
    const ord = this.orden();

    const getValue = (l: any) =>
      (attr === 'nombre' || attr === 'categoria') ? l.producto[attr] : l[attr];

    return this.lotes()
      .filter(l => attr ? String(getValue(l)).toLowerCase().includes(filtro) : true)
      .sort((a, b) => {
        if (!ord || !attr) return 0;
        const A = getValue(a);
        const B = getValue(b);

        if (typeof A === 'number' && typeof B === 'number') {
          return ord === 'asc' ? A - B : B - A;
        }

        return ord === 'asc'
          ? String(A).localeCompare(String(B))
          : String(B).localeCompare(String(A));
      });
  });

  deleteLote(id: number) {
    if (confirm("Desea eliminar?")) {
      this.loteService.delete(id).subscribe({
        next: () => {
          this.toast.success("Lote eliminado correctamente");
        }
      });
    }
  }

  updateLote(lote: Lote) {
    this.loteService.selectLoteToEdit(lote);
    this.router.navigate(['/menu/lotes/form']);
  }

  exportarExcel() {
    this.loteService.exportarExcel();
  }
}
