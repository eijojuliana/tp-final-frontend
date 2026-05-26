import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from "../../app.routes";
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../styles/theme.service';
import { TiendaService } from '../../services/tienda-service';
import { CuentaBancariaService } from '../../services/cuenta-bancaria-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, AppRoutingModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  menuAbierto: boolean = false;
  animating = false;

  public logout = inject(AuthService);
  public authService = inject(AuthService);
  public theme = inject(ThemeService);
  public tiendaService = inject(TiendaService);
  private cuentaBancariaService = inject(CuentaBancariaService);
  private route = inject(Router);

  // Trae el efectivo en caja directamente de la tienda
  efectivoEnCaja = computed(() => {
    const tienda = this.tiendaService.tienda();
    return tienda ? tienda.caja : 0;
  });

  // Suma el saldo de todas las cuentas bancarias usando la señal correcta: cuentasBancarias()
  saldoEnCuentas = computed(() => {
    return this.cuentaBancariaService.cuentasBancarias().reduce((total, c) => total + (c.saldo || 0), 0);
  });

  ngOnInit(): void {
    this.theme.init();
    this.tiendaService.load(); // Asegura que la info de la tienda esté cargada para la caja
  }

  cerrarSesion() {
    this.logout.clearCredentials();
    this.route.navigate(['/login']);
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  toggleTheme(): void {
    this.animating = true;
    this.theme.toggle();
    setTimeout(() => (this.animating = false), 200);
  }
}
