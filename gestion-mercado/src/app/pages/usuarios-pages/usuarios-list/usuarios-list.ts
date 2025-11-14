import { Component, inject } from '@angular/core';
import { UsuarioService } from '../../../services/usuario-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuarios-list',
  imports: [RouterLink],
  templateUrl: './usuarios-list.html',
  styleUrl: './usuarios-list.css',
})
export class UsuariosList {
  private usuarioService = inject(UsuarioService);
  public usuarios = this.usuarioService.usuarios;
}
