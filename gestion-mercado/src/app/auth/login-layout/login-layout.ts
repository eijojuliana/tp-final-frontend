import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { environment } from '../../services/ip';
import { ToastService } from '../../services/toast.service';




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

  passwordVisible: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private toast: ToastService
  ) { }

 ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/ya-logueado']);
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
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
          this.toast.success("Login realizado correctamente.");

          // 3. Guardar rol y nombre en el AuthService
          this.authService.setRoleFromBackendRoles(profile.roles);
          this.authService.fetchAndSetPersonaName();

          // Dueño/Admin → menú general
          this.router.navigate(['/menu']);

        },
        error: (err) => {
          console.error('Error en login:', err);
          this.toast.error("Usuario o contraseña incorrectos");
          this.authService.clearCredentials();
          this.errorMsg = 'Usuario o contraseña incorrectos';
        }
      });
  }









}
