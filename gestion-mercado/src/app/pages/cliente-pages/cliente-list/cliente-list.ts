import { Component, computed, effect, inject, signal } from '@angular/core';
import { ClienteService } from '../../../services/cliente-service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-cliente-list',
  imports: [RouterLink],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css',
})
export class ClienteList {
  service=inject(ClienteService);
  clientes=this.service.clientes;
  router=inject(Router);
  private toast = inject(ToastService);

  filtro = signal('');
  atributo = signal<'personaId' | 'clienteId' | 'nombre' | 'dni' | 'edad'>('personaId');
  orden = signal<'asc' | 'desc'>('asc');

  clientesFiltrados = computed(() => {
  const filtro = this.filtro().toLowerCase().trim();
  const attr = this.atributo();
  const ord = this.orden();

  return this.clientes()
    .filter(c => filtro ? String((c as any)[attr]).toLowerCase().includes(filtro) : true)
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

  eliminarCliente(id: number) {
    if (confirm("¿Desea eliminar este cliente?")) {
      this.service.eliminar(id).subscribe({
        next: () => {
          this.toast.success("Cliente eliminado correctamente");
          console.log(`Cliente con el id: ${id} eliminado`);
        }
      });
    }
  }

  modificarCliente(cliente:any){
    this.service.selectClienteToEdit(cliente);
    this.router.navigate(['menu/clientes/form']);
  }
}
