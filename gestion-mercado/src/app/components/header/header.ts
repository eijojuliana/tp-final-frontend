import { PedidoService } from './../../services/pedido-service';
import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from "../../app.routes";
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../styles/theme.service';
import { TiendaService } from '../../services/tienda-service';
import { CuentaBancariaService } from '../../services/cuenta-bancaria-service';
import { SidebarStateService } from '../sidebar/sidebar-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, AppRoutingModule, FormsModule],
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
  public pedidoService = inject(PedidoService);
  private route = inject(Router);
  private sidebarState = inject(SidebarStateService);

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
    if (this.authService.isLoggedIn()) {
      this.pedidoService.verificarEstadoCaja();
      this.tiendaService.load();
    }
    this.theme.init();
  }

  cerrarSesion() {
    this.logout.clearCredentials();
    this.route.navigate(['/login']);
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  get sidebarOpen(): boolean {
    return this.sidebarState.isOpen();
  }

  toggleSidebar(): void {
    this.sidebarState.toggle();
  }

  toggleTheme(): void {
    this.animating = true;
    this.theme.toggle();
    setTimeout(() => (this.animating = false), 200);
  }

  // --- Abrir caja desde el header ---
  mostrarModalAbrirCaja = false;
  credencialEmail = '';
  credencialPassword = '';
  errorAbrirCaja = '';

  abrirModalAbrirCaja() {
    this.mostrarModalAbrirCaja = true;
    this.credencialEmail = '';
    this.credencialPassword = '';
    this.errorAbrirCaja = '';
  }

  confirmarAbrirCaja() {
    this.errorAbrirCaja = '';
    this.tiendaService.abrirCaja(this.credencialEmail, this.credencialPassword).subscribe({
      next: (res: any) => {
        if (res.exito) {
          this.mostrarModalAbrirCaja = false;
          this.pedidoService.verificarEstadoCaja();
        } else {
          this.errorAbrirCaja = res.mensaje || 'Error al abrir la caja';
        }
      },
      error: (err) => {
        this.errorAbrirCaja = err.error?.mensaje || 'Credenciales inválidas';
      }
    });
  }
}
