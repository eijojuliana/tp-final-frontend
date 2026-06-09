import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ThemeService } from '../../styles/theme.service';
import { TiendaService } from '../../services/tienda-service';
import { SidebarStateService } from './sidebar-state.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {

  public auth = inject(AuthService);
  public theme = inject(ThemeService);
  public tiendaService = inject(TiendaService);
  public sidebarState = inject(SidebarStateService);

  get currentRole(): string | null {
    return this.auth.getRole();
  }

  openMenu: string | null = null;

  get isSidebarOpen(): boolean {
    return this.sidebarState.isOpen();
  }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      const tiendaActual = this.tiendaService.tienda();
      if (!tiendaActual || !tiendaActual.tiendaId || tiendaActual.tiendaId <= 0) { this.tiendaService.load(); }
    }
  }

  toggleMenu(menu: string) {
    if (!this.isSidebarOpen) {
      this.sidebarState.open();
    }
    this.openMenu = this.openMenu === menu ? null : menu;
  }

  toggleMobileMenu() {
    this.sidebarState.toggle();
  }

  closeMobileMenu() {
    this.sidebarState.close();
  }
}
