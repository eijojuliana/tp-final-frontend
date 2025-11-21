import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ya-logueado',
  imports: [],
  templateUrl: './ya-logueado.html',
  styleUrl: './ya-logueado.css',
})
export class YaLogueado {
constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  irAlMenu() {
    this.router.navigate(['/menu']);
  }

  cambiarDeUsuario() {
    this.auth.clearCredentials();
    this.router.navigate(['/login']);
  }
}
