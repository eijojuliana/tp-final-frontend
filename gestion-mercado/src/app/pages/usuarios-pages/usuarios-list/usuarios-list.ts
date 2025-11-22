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
  atributo = signal<'email'>('email');
  orden = signal<'asc' | 'desc'>('asc');

  usuariosFiltrados = computed(() => {
    const f = this.filtro().toLowerCase().trim();
    const attr = this.atributo();
    const order = this.orden();

    return this.usuarios()
      .filter((u) =>
        String((u as any)[attr]).toLowerCase().includes(f)
      )
      .sort((a, b) => {
        const A = String((a as any)[attr]).toLowerCase();
        const B = String((b as any)[attr]).toLowerCase();

        return order === 'asc'
          ? A.localeCompare(B)
          : B.localeCompare(A);
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
