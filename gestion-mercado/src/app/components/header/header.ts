// header.ts (CORREGIDO)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from "../../app.routes";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, AppRoutingModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  menuAbierto: boolean = false;

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }
}
