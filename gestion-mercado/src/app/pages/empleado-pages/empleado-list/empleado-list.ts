import { Router, RouterLink } from '@angular/router';
import { EmpleadoService } from './../../../services/empleado-service';
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-empleado-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './empleado-list.html',
  styleUrl: './empleado-list.css',
})
export class EmpleadoList implements OnInit {

  ngOnInit() {
    this.service.load();
  }

  service = inject(EmpleadoService);
  empleados = this.service.empleados;
  router = inject(Router);
  private toast = inject(ToastService);

  filtro = signal('');
  atributo = signal<string>('');
  orden = signal<'asc' | 'desc' | ''>('');

  empleadosFiltrados = computed(() => {
    const filtro = this.filtro().toLowerCase().trim();
    const attr = this.atributo();
    const ord = this.orden();

    return this.empleados()
      .filter(e => (attr && filtro ? String((e as any)[attr]).toLowerCase().includes(filtro) : true))
      .sort((a, b) => {
        if (!ord || !attr) return 0;
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

  eliminarEmpleado(id: number) {
    if (confirm("Desea eliminar este empleado?")) {
      this.service.delete(id).subscribe({
        next: () => this.toast.success("Empleado eliminado correctamente")
      });
    }
  }

  modificarEmpleado(empleado: any) {
    this.service.selectEmpleadoToEdit(empleado);
    this.router.navigate(['/menu/empleados/form']);
  }

  exportarExcel() {
    this.service.exportarExcel();
  }
}
