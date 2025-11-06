// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Almacena las credenciales validadas. ¡Recuerda las notas de seguridad!
  private userCreds: { username: string, password: string } | null = null;

  constructor() {
    this.setCredentials('123', '0000');
    console.log('Basic Auth configurado con credenciales estáticas.');
  }

  // Guarda las credenciales después de un login exitoso
  setCredentials(username: string, password: string): void {
    this.userCreds = { username, password };
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