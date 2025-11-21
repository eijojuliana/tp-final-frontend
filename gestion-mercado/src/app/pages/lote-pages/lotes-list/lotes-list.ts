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
  atributo = signal<'nombre' | 'categoria' | 'cantidadDisponible' | 'costoUnitario' | 'fechaIngreso'>('nombre');

  lotesFiltrados = computed(() => {
    const f = this.filtro().toLowerCase().trim();
    const attr = this.atributo();

    return this.lotes().filter(l => {
      if (attr === 'nombre') { return l.producto.nombre.toLowerCase().includes(f); }
      if (attr === 'categoria') { return l.producto.categoria.toLowerCase().includes(f); }
      return String((l as any)[attr]).toLowerCase().includes(f);
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
