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
  atributo = signal<'nombre' | 'dni' | 'edad' | 'email'>('nombre');

  dueniosFiltrados = computed(() => {
    const f = this.filtro().toLowerCase().trim();
    const attr = this.atributo();

    return this.duenios().filter((d) =>
      String((d as any)[attr])
        .toLowerCase()
        .includes(f)
    );
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
