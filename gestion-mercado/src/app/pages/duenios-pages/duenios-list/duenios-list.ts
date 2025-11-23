import { Component, computed, inject, signal } from '@angular/core';
import { DuenioService } from '../../../services/duenio-service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-duenio-list',
  imports: [RouterLink],
  templateUrl: './duenios-list.html',
  styleUrl: './duenios-list.css',
})
export class DueniosList {
  service = inject(DuenioService);
  duenios = this.service.duenios;
  router=inject(Router);
  private toast = inject(ToastService);

  filtro = signal('');
  atributo = signal<'personaId' | 'duenioId' | 'nombre' | 'dni' | 'edad' | 'email'>('personaId');
  orden = signal<'asc' | 'desc'>('asc');

  dueniosFiltrados = computed(() => {
    const filtro = this.filtro().toLowerCase().trim();
    const attr = this.atributo();
    const ord = this.orden();

    return this.duenios()
      .filter(d => filtro ? String((d as any)[attr]).toLowerCase().includes(filtro) : true)
      .sort((a, b) => {
        const A = (a as any)[attr];
        const B = (b as any)[attr];

        if (typeof A === 'number' && typeof B === 'number') {
          return ord === 'asc' ? A - B : B - A;
        }

        return ord === 'asc'
          ? String(A).localeCompare(String(B))
          : String(B).localeCompare(String(A));
      });
  });

  eliminarDuenio(id: number) {
    if (confirm('Desea eliminar este duenio?')) {
      this.service.delete(id).subscribe({
        next: () => {
          this.toast.success("Dueño eliminado correctamente");
          console.log(`Duenio con id ${id} eliminado.`);
        }
      });
    }
  }


  modificarDuenio(duenio: any) {
    this.service.selectDuenioToEdit(duenio);
    this.router.navigate(['menu/duenios/form']);
  }
}
