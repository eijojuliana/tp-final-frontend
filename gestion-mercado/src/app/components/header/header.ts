// header.ts (CORREGIDO)
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from "../../app.routes";
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../styles/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, AppRoutingModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit{
  menuAbierto: boolean = false;

  public logout=inject(AuthService);
  public authService=inject(AuthService);
  route=inject(Router);


  cerrarSesion(){
    this.logout.clearCredentials();
    this.route.navigate(['/login'])
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  //Temas
  animating = false;

  constructor(public theme: ThemeService) {}

  ngOnInit(): void {
    this.theme.init();
  }

  toggleTheme(): void {
    this.animating = true;
    this.theme.toggle();
    setTimeout(() => (this.animating = false), 200);
  }
}
