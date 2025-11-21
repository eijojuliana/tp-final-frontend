import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';




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
export class LoginLayout {
  username: string = '';
  password: string = '';
  errorMsg: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

login(): void {
    this.errorMsg = '';

    if (!this.username || !this.password) {
      this.errorMsg = 'Completá usuario y contraseña';
      return;
    }

    // 1. Guardar credenciales en el AuthService
    this.authService.setCredentials(this.username, this.password);

    // 2. Probar contra el back pidiendo /api/auth/profile
    this.http.get<UserProfileResponse>('http://localhost:8080/api/auth/profile')
      .subscribe({
        next: (profile) => {
          // Acá llegamos SOLO si el back aceptó las credenciales
          console.log('Perfil recibido:', profile);

          // 3. Guardar rol en el AuthService
          this.authService.setRoleFromBackendRoles(profile.roles);

          // 4. Elegir a dónde redirigir según el rol
          const rolesLimpios = profile.roles.map(r => r.replace('ROLE_', ''));

          if (rolesLimpios.includes('ADMIN') || rolesLimpios.includes('DUENIO')) {
            // Dueño/Admin → menú general
            this.router.navigate(['/menu']);
          } else if (rolesLimpios.includes('EMPLEADO')) {
            // Empleado → por ejemplo, la sección de pedidos o tienda
            this.router.navigate(['/menu/empleados']);
          } else {
            // Si por algún motivo no viene rol, lo mando al menú básico
            this.router.navigate(['/menu']);
          }
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
