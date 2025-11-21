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
  atributo = signal<'nombre' | 'dni'|'edad'|'email'>('nombre');

  empleadosFiltrados = computed(() => {
    const f = this.filtro().toLowerCase().trim();
    const attr = this.atributo();

    return this.empleados().filter(e =>
      String((e as any)[attr]).toLowerCase().includes(f)
    );
  });

  eliminarEmpleado(id:number){
    if(confirm("Desea eliminar este empleado?")){
      this.service.eliminar(id).subscribe({
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
