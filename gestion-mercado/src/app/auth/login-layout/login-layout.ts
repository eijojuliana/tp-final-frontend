import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { environment } from '../../services/ip';




interface UserProfileResponse {
  username: string;
  roles: string[]; // ["ROLE_ADMIN", "ROLE_DUENIO", "ROLE_EMPLEADO"]
}

@Component({
  selector: 'app-login-layout',
  standalone: false,
  templateUrl: './login-layout.html',
  styleUrl: './login-layout.css',
})
export class LoginLayout implements OnInit{
  username: string = '';
  password: string = '';
  errorMsg: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

 ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/ya-logueado']);
    }
  }

login(): void {
    this.errorMsg = '';

    if (!this.username || !this.password) {
      this.errorMsg = 'Completá usuario y contraseña';
      return;
    }

    // 1. Guardar credenciales en el AuthService
    this.authService.setCredentials(this.username, this.password);

    // 2. Probar contra el back pidiendo /api/auth/profile
    this.http.get<UserProfileResponse>( environment.apiBaseUrl + '/auth/profile')
      .subscribe({
        next: (profile) => {
          // Acá llegamos SOLO si el back aceptó las credenciales
          console.log('Perfil recibido:', profile);

          // 3. Guardar rol en el AuthService
          this.authService.setRoleFromBackendRoles(profile.roles);

            // Dueño/Admin → menú general
            this.router.navigate(['/menu']);

        },
        error: (err) => {
          console.error('Error en login:', err);
          // 5. Si hubo error (401, etc.), limpiar credenciales y mostrar mensaje
          this.authService.clearCredentials();
          this.errorMsg = 'Usuario o contraseña incorrectos';
        }
      });
  }









}
