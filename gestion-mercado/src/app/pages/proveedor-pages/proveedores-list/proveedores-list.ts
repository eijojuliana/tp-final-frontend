import { Component, computed, inject, signal } from '@angular/core';
import { ProveedorService } from '../../../services/proveedor-service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-proveedores-list',
  imports: [RouterLink],
  templateUrl: './proveedores-list.html',
  styleUrl: './proveedores-list.css',
})

export class ProveedoresList {
  service=inject(ProveedorService);
  proveedores=this.service.proveedores;
  router=inject(Router);
  private toast = inject(ToastService);

  filtro = signal('');
  atributo = signal<'nombre' | 'dni'|'edad'>('nombre');

  proveedoresFiltrados = computed(() => {
    const f = this.filtro().toLowerCase().trim();
    const attr = this.atributo();

    return this.proveedores().filter(p =>
      String((p as any)[attr]).toLowerCase().includes(f)
    );
  });

  eliminarProveedor(id:number){
    if(confirm("¿Desea eliminar este proveedor?")){
      this.service.delete(id).subscribe({
        next: () => {
          this.toast.success("Proveedor eliminado correctamente");
          console.log(`Proveedor con el id:${id} eliminado`);
        }
      });
    }
  }

  modificarProveedor(proveedor:any){
    this.service.selectProveedorToEdit(proveedor);
    this.router.navigate(['menu/proveedores/form']);
  }
}
