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
  atributo = signal<'nombre' | 'dni'|'edad'>('nombre');

  clientesFiltrados = computed(() => {
    const f = this.filtro().toLowerCase().trim();
    const attr = this.atributo();

    return this.clientes().filter(c =>
      String((c as any)[attr]).toLowerCase().includes(f)
    );
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
