import { Router, RouterLink } from '@angular/router';
import { EmpleadoService } from './../../../services/empleado-service';
import { Component, computed, inject, signal } from '@angular/core';
import { ToastService } from '../../../services/toast.service';


@Component({
  selector: 'app-empleado-list',
  imports: [RouterLink],
  templateUrl: './empleado-list.html',
  styleUrl: './empleado-list.css',
})
export class EmpleadoList {
 service=inject(EmpleadoService);
 empleados=this.service.empleados;
 router=inject(Router);
 private toast = inject(ToastService);

  filtro = signal('');
  atributo = signal<'personaId' | 'empleadoId' | 'nombre' | 'dni' | 'edad' | 'email'>('personaId');
  orden = signal<'asc' | 'desc'>('asc');

  empleadosFiltrados = computed(() => {
    const filtro = this.filtro();
    const attr = this.atributo();
    const ord = this.orden();

    return this.empleados()
      .filter(e => filtro ? (e as any)[attr] === filtro : true)
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

  eliminarEmpleado(id:number){
    if(confirm("Desea eliminar este empleado?")){
      this.service.delete(id).subscribe({
        next: () => {
          this.toast.success("Empleado eliminado correctamente");
          console.log(`Empleado con id ${id} eliminado.`);
        }
      });
    }
  }

  modificarEmpleado(empleado:any){
    this.service.selectEmpleadoToEdit(empleado);
    this.router.navigate(['menu/empleados/form'])
  }
}
