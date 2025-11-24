import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../services/ip';
import { Persona } from '../models/persona.model';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../services/toast.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private toast = inject(ToastService);

  private STORAGE_CREDS = 'authCreds';
  private STORAGE_ROLE = 'authRole';
  private STORAGE_NOMBRE = 'authPersonaName';

  private userCreds: { username: string; password: string } | null = null;
  private currentRole: string | null = null;
  private nombre: string | null = null;

  constructor(private http: HttpClient) {
    // Levantar de sessionStorage si ya había sesión guardada
    const storedCreds = sessionStorage.getItem(this.STORAGE_CREDS);
    const storedRole = sessionStorage.getItem(this.STORAGE_ROLE);
    const storedPersonaName = sessionStorage.getItem(this.STORAGE_NOMBRE);

    if (storedCreds) {
      this.userCreds = JSON.parse(storedCreds);
    }
    if (storedRole) {
      this.currentRole = storedRole;
    }
    if (storedPersonaName) {
      this.nombre = storedPersonaName;
    }
  }

  setCredentials(username: string, password: string): void {
    this.userCreds = { username, password };
    sessionStorage.setItem(this.STORAGE_CREDS, JSON.stringify(this.userCreds));
  }

  clearCredentials(): void {
    this.userCreds = null;
    this.currentRole = null;
    this.nombre = null;
    sessionStorage.removeItem(this.STORAGE_CREDS);
    sessionStorage.removeItem(this.STORAGE_ROLE);
    sessionStorage.removeItem(this.STORAGE_NOMBRE);
  }

  isLoggedIn(): boolean {
    return this.userCreds !== null;
  }

  // ---- roles ----
  setRoleFromBackendRoles(rolesFromBackend: string[]): void {
    const cleaned = rolesFromBackend.map(r => r.replace('ROLE_', ''));
    this.currentRole = cleaned[0] ?? null;

    if (this.currentRole) {
      sessionStorage.setItem(this.STORAGE_ROLE, this.currentRole);
    } else {
      sessionStorage.removeItem(this.STORAGE_ROLE);
    }
  }

  getRole(): string | null {
    return this.currentRole;
  }

  hasRole(rolesPermitidos: string[]): boolean {
    if (!this.currentRole) return false;
    return rolesPermitidos.includes(this.currentRole);
  }

  // ---- Basic Auth header para el interceptor ----
  getAuthHeaderValue(): string | null {
    if (this.userCreds) {
      const authString = `${this.userCreds.username}:${this.userCreds.password}`;
      const base64Auth = btoa(authString);
      return `Basic ${base64Auth}`;
    }
    return null;
  }

  getUsername() {
    return this.userCreds?.username;
  }

  // ---- nombre de la persona logueada ----
  getPersonaName(): string | null {
    return this.nombre;
  }

  setPersonaName(nombre: string): void {
    this.nombre = nombre;
    sessionStorage.setItem(this.STORAGE_NOMBRE, nombre);
  }

  async fetchAndSetPersonaName(): Promise<void> {
    const email = this.getUsername();
    const role = this.getRole();
    if (!email || !role) {
      this.setPersonaName(this.getUsername() ?? 'Usuario');
      return;
    }

    let url: string | null = null;
    switch (role) {
      case 'DUENIO':
        url = `${environment.apiBaseUrl}/duenios/buscarXEmail/${email}`;
        break;
      case 'EMPLEADO':
        url = `${environment.apiBaseUrl}/empleados/buscarXEmail/${email}`;
        break;
      default:
        this.setPersonaName('ADMIN');
        return;
    }

    try {
      const personaDTO = await firstValueFrom(
        this.http.get<Persona>(url)
      );

      const fullName = personaDTO.nombre;
      this.setPersonaName(fullName);

    } catch (error) {
      console.error(`Error al obtener datos de la persona (${role}):`, error);
      this.toast.error(`Error al obtener el nombre del usuario (${email}).`);
      this.setPersonaName('Usuario');
    }
  }
}
