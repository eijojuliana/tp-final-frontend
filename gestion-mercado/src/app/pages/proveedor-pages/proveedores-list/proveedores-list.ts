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
  atributo = signal<'personaId' | 'proveedorId' | 'nombre' | 'dni' | 'edad'>('personaId');
  orden = signal<'asc' | 'desc'>('asc');

  proveedoresFiltrados = computed(() => {
    const filtro = this.filtro().toLowerCase().trim();
    const attr = this.atributo();
    const ord = this.orden();

    return this.proveedores()
      .filter(p => filtro ? String((p as any)[attr]).toLowerCase().includes(filtro) : true)
      .sort((a, b) => {
        const A = (a as any)[attr];
        const B = (b as any)[attr];

        if (typeof A === 'number' && typeof B === 'number') {
          return ord === 'asc' ? A - B : B - A;
        }

        return ord === 'asc'
          ? String(A).toLowerCase().localeCompare(String(B).toLowerCase())
          : String(B).toLowerCase().localeCompare(String(A).toLowerCase());
      });
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
