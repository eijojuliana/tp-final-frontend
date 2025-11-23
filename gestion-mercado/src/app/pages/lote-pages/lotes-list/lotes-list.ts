import { Router, RouterLink } from '@angular/router';
import { LoteService } from '../../../services/lote-service';
import { Component, computed, inject, signal } from '@angular/core';
import { Lote } from '../../../models/lote.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-lotes-list',
  imports: [RouterLink],
  templateUrl: './lotes-list.html',
  styleUrl: './lotes-list.css',
})
export class LotesList {
  private loteService = inject(LoteService);
  lotes = this.loteService.lotes;
  private router = inject(Router);
  private toast = inject(ToastService);

  filtro = signal('');
  atributo = signal<'lote_id' | 'nombre' | 'categoria' | 'cantidadDisponible' | 'costoUnitario' | 'fechaIngreso'>('lote_id');
  orden = signal<'asc' | 'desc'>('asc');

  lotesFiltrados = computed(() => {
    const filtro = this.filtro().toLowerCase();
    const attr = this.atributo();
    const ord = this.orden();

    // filtrar acá se alarga por el tema de que recibo un Producto completo y no es sólo id je
    const getValue = (l: any) =>
      (attr === 'nombre' || attr === 'categoria') ? l.producto[attr] : l[attr];

    return this.lotes()
      .filter(l => String(getValue(l)).toLowerCase().includes(filtro))
      .sort((a, b) => {
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


  deleteLote(id:number) {
    if(confirm("Desea eliminar?")) {
      this.loteService.delete(id).subscribe({
        next: () => {
          this.toast.success("Lote eliminado correctamente");
          console.log(`Lote de ID: ${id} eliminado.`);
        }
      });
    }
  }

  updateLote(lote:Lote) {
    this.loteService.seleccionarLoteToEdit(lote);
    this.router.navigate(['/menu/lotes/form']);
  }
}
