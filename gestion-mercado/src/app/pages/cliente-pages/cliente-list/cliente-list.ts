import { Component, computed, inject, signal } from '@angular/core';
import { ClienteService } from '../../../services/cliente-service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { Cliente } from '../../../models/cliente.model';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css',
})
export class ClienteList {
  service = inject(ClienteService);
  clientes = this.service.clientes;
  router = inject(Router);
  private toast = inject(ToastService);

  filtro = signal('');
  atributo = signal<string>('');
  orden = signal<'asc' | 'desc' | ''>('');

  clientesFiltrados = computed(() => {
    const filtro = this.filtro().toLowerCase().trim();
    const attr = this.atributo();
    const ord = this.orden();

    return this.clientes()
      .filter(c => (attr && filtro ? String((c as any)[attr]).toLowerCase().includes(filtro) : true))
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

  eliminarCliente(id: number) {
    if (confirm("¿Desea eliminar este cliente?")) {
      this.service.delete(id).subscribe({
        next: () => this.toast.success("Cliente eliminado correctamente")
      });
    }
  }

  modificarCliente(cliente: Cliente) {
    this.service.selectClienteToEdit(cliente);
    this.router.navigate(['/menu/clientes/form']);
  }

  exportarExcel() {
    this.service.exportarExcel();
  }
}
