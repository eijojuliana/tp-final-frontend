import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario-service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.css',
})
export class UsuariosList implements OnInit {

  ngOnInit() {
    this.usuarioService.load();
  }

  private usuarioService = inject(UsuarioService);
  public usuarios = this.usuarioService.usuarios;
  router = inject(Router);
  private toast = inject(ToastService);

  filtro = signal('');
  atributo = signal<string>('');
  orden = signal<'asc' | 'desc' | ''>('');

  usuariosFiltrados = computed(() => {
    const filtro = this.filtro().toLowerCase().trim();
    const attr = this.atributo();
    const ord = this.orden();

    return this.usuarios()
      .filter(u => (attr && filtro ? String((u as any)[attr]).toLowerCase().includes(filtro) : true))
      .sort((a, b) => {
        if (!ord || !attr) return 0;

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
        }
      });
    }
  }

  modificarUsuario(usuario: any) {
    this.usuarioService.selectUsuarioToEdit(usuario);
    this.router.navigate(['/menu/usuarios/form']);
  }

  exportarExcel() {
    this.usuarioService.exportarExcel();
  }
}
