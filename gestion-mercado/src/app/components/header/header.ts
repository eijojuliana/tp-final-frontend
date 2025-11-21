// header.ts (CORREGIDO)
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from "../../app.routes";
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, AppRoutingModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  menuAbierto: boolean = false;

  public logout=inject(AuthService);
  route=inject(Router);


  cerrarSesion(){
    this.logout.clearCredentials();
    this.route.navigate(['/login'])
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }
}
