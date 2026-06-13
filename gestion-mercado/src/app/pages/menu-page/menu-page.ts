import { RouterLink } from '@angular/router';
import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { ThemeService } from '../../styles/theme.service';
import { environment } from '../../services/ip';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './menu-page.html',
  styleUrl: './menu-page.css',
})
export class MenuPage implements OnInit {
  public authService=inject(AuthService);
  private http = inject(HttpClient);

  stats = signal<any | null>(null);
  movimientosHoy = signal<any[]>([]);
  cargandoStats = signal(true);
  cargandoMovimientos = signal(true);
  hoy = Date.now();

  constructor(public auth: AuthService , public theme: ThemeService) { }

  ngOnInit() {
    this.cargarResumen();
    this.cargarMovimientos();
  }

  cargarResumen() {
    const hoy = new Date().toLocaleDateString('en-CA');
    this.http.get(`${environment.apiBaseUrl}/stats/dashboard?inicio=${hoy}&fin=${hoy}`)
      .subscribe({
        next: (res: any) => {
          console.log('[MenuPage] Resumen cargado:', res);
          this.stats.set(res);
          this.cargandoStats.set(false);
        },
        error: (err) => {
          console.error('[MenuPage] Error al cargar resumen:', err);
          this.stats.set(null);
          this.cargandoStats.set(false);
        }
      });
  }

  cargarMovimientos() {
    const hoy = new Date().toLocaleDateString('en-CA');
    this.http.get<any[]>(`${environment.apiBaseUrl}/transacciones`)
      .subscribe({
        next: data => {
          const filtrados = data
            .filter(t => new Date(t.fecha).toLocaleDateString('en-CA') === hoy)
            .slice(-10)
            .reverse();
          console.log('[MenuPage] Movimientos hoy:', filtrados);
          this.movimientosHoy.set(filtrados);
          this.cargandoMovimientos.set(false);
        },
        error: (err) => {
          console.error('[MenuPage] Error al cargar movimientos:', err);
          this.movimientosHoy.set([]);
          this.cargandoMovimientos.set(false);
        }
      });
  }

  get currentRole(): string | null {
    return this.auth.getRole();
  }

  iconPath(base: string): string {
    return this.theme.isOscuro()
      ? `/assets/images/${base}.png`
      : `/assets/images/${base}-oscuro.png`;
  }
}
