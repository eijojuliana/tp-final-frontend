// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {


 private STORAGE_CREDS = 'authCreds';
  private STORAGE_ROLE = 'authRole';

  private userCreds: { username: string; password: string } | null = null;
  private currentRole: string | null = null;

  constructor() {
    // Levantar de localStorage si ya había sesión guardada
    const storedCreds = localStorage.getItem(this.STORAGE_CREDS);
    const storedRole = localStorage.getItem(this.STORAGE_ROLE);

    if (storedCreds) {
      this.userCreds = JSON.parse(storedCreds);
    }
    if (storedRole) {
      this.currentRole = storedRole;
    }
  }

  setCredentials(username: string, password: string): void {
    this.userCreds = { username, password };
    localStorage.setItem(this.STORAGE_CREDS, JSON.stringify(this.userCreds));
  }

  clearCredentials(): void {
    this.userCreds = null;
    this.currentRole = null;
    localStorage.removeItem(this.STORAGE_CREDS);
    localStorage.removeItem(this.STORAGE_ROLE);
  }

  isLoggedIn(): boolean {
    return this.userCreds !== null;
  }

  // ---- roles ----
  setRoleFromBackendRoles(rolesFromBackend: string[]): void {
    const cleaned = rolesFromBackend.map(r => r.replace('ROLE_', ''));
    this.currentRole = cleaned[0] ?? null;

    if (this.currentRole) {
      localStorage.setItem(this.STORAGE_ROLE, this.currentRole);
    } else {
      localStorage.removeItem(this.STORAGE_ROLE);
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


  
}
