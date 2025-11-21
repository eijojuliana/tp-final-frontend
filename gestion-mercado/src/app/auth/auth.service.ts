// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Almacena las credenciales validadas. ¡Recuerda las notas de seguridad!
  private userCreds: { username: string, password: string } | null = null;

    // Rol actual simplificado: 'ADMIN' | 'DUENIO' | 'EMPLEADO' | null
  private currentRole: string | null = null;


  constructor() {

  }




  // Guarda las credenciales después de un login exitoso
  setCredentials(username: string, password: string): void {
    this.userCreds = { username, password };
  }

  clearCredentials(): void {
    this.userCreds = null;
    this.currentRole = null;
  }

  isLoggedIn(): boolean {
    return this.userCreds !== null;
  }

// ---- Manejo de roles ----
  setRoleFromBackendRoles(rolesFromBackend: string[]): void {
    // rolesFromBackend = ['ROLE_ADMIN', 'ROLE_DUENIO', ...]
    const cleaned = rolesFromBackend.map(r => r.replace('ROLE_', ''));

    // Me quedo con el primero como rol principal
    this.currentRole = cleaned[0] ?? null;
  }

  getRole(): string | null {
    return this.currentRole;
  }

  hasRole(rolesPermitidos: string[]): boolean {
    if (!this.currentRole) return false;
    return rolesPermitidos.includes(this.currentRole);
  }



  // Genera el valor del encabezado Authorization: Basic [Base64(usuario:contraseña)].
  getAuthHeaderValue(): string | null {
    if (this.userCreds) {
      // 1. Concatena el usuario y la contraseña: 'usuario:contraseña'
      const authString = `${this.userCreds.username}:${this.userCreds.password}`;

      // 2. Codifica en Base64. btoa() es una función nativa de JS.
      const base64Auth = btoa(authString);

      // 3. Devuelve el encabezado completo.
      return `Basic ${base64Auth}`;
    }
    return null;
  }
}
