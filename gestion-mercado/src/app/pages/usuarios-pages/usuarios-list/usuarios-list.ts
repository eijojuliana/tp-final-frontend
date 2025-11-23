import { Component, computed, inject, signal } from '@angular/core';
import { UsuarioService } from '../../../services/usuario-service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-usuarios-list',
  imports: [RouterLink],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.css',
})
export class UsuariosList {

  private usuarioService = inject(UsuarioService);
  public usuarios = this.usuarioService.usuarios;
  router=inject(Router);
  private toast = inject(ToastService);

  filtro = signal('');
  atributo = signal<'usuarioId' | 'email'>('usuarioId');
  orden = signal<'asc' | 'desc'>('asc');

  usuariosFiltrados = computed(() => {
    const filtro = this.filtro().toLowerCase().trim();
    const attr = this.atributo();
    const ord = this.orden();

    return this.usuarios()
      .filter(u => filtro ? String((u as any)[attr]).toLowerCase().includes(filtro) : true)
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

  eliminarUsuario(id: number) {
    if (confirm('Desea eliminar este usuario?')) {
      this.usuarioService.delete(id).subscribe({
        next: () => {
          this.toast.success("Usuario eliminado correctamente");
          console.log(`Usuario con id ${id} eliminado.`);
        }
      });
    }
  }

  modificarUsuario(usuario: any) {
    this.usuarioService.selectUsuarioToEdit(usuario);
    this.router.navigate(['menu/usuarios/form']);
  }
}
