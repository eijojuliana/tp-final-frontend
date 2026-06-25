import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TiendaService } from '../../services/tienda-service';
import { ToastService } from '../../services/toast.service';
import { PedidoService } from '../../services/pedido-service';
import { environment } from '../../services/ip';

@Component({
  selector: 'app-cierre-caja',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cierre-caja.component.html',
  styleUrl: './cierre-caja.component.css'
})
export class CierreCajaComponent implements OnInit {
  private http = inject(HttpClient);
  private tiendaService = inject(TiendaService);
  protected pedidoService = inject(PedidoService);
  private toast = inject(ToastService);

  saldoInicial = signal<number>(0);
  ingresosEfectivo = signal<number>(0);
  egresosGastos = signal<number>(0);
  saldoRealContado = signal<number | null>(null);
  ajustesHoy = signal<number>(0);

  mostrarModalAbrir = signal(false);
  credencialEmail = '';
  credencialPassword = '';
  errorAbrirCaja = signal('');

  confirmarAbrirCaja() {
    this.errorAbrirCaja.set('');
    this.tiendaService.abrirCaja(this.credencialEmail, this.credencialPassword).subscribe({
      next: (res: any) => {
        if (res.exito) {
          this.toast.success('Caja abierta correctamente');
          this.mostrarModalAbrir.set(false);
          this.credencialEmail = '';
          this.credencialPassword = '';
          this.pedidoService.verificarEstadoCaja();
        } else {
          this.errorAbrirCaja.set(res.mensaje || 'Error al abrir la caja');
        }
      },
      error: (err) => {
        this.errorAbrirCaja.set(err.error?.mensaje || 'Credenciales inválidas');
      }
    });
  }

  saldoBase = computed(() => {
    return this.saldoInicial() + this.ingresosEfectivo() - this.egresosGastos();
  });

  saldoDigitalEsperado = computed(() => {
    return this.saldoBase() + this.ajustesHoy();
  });

  diferencia = computed(() => {
    const real = this.saldoRealContado();
    if (real === null) return null;
    return real - this.saldoDigitalEsperado();
  });

  ngOnInit() {
    this.cargarDatosDelDia(() => this.cargarSaldoCaja());
  }

  cargarDatosDelDia(onDone?: () => void) {
    const hoy = new Date().toLocaleDateString('en-CA');
    const url = `${environment.apiBaseUrl}/stats/caja-diaria?fecha=${hoy}`;

    this.http.get(url).subscribe((res: any) => {
      if (res) {
        this.ingresosEfectivo.set(res.ingresosEfectivo || 0);
        this.egresosGastos.set(res.egresosGastos || 0);
        this.ajustesHoy.set(res.ajustesHoy || 0);
      }
      onDone?.();
    });
  }

  cargarSaldoCaja() {
    this.http.get<any>(`${environment.apiBaseUrl}/configuracion-tienda/1`).subscribe({
      next: (tienda) => {
        const saldoBD = tienda.caja ?? 0;
        const neto = this.ingresosEfectivo() - this.egresosGastos() - this.ajustesHoy();
        this.saldoInicial.set(saldoBD - neto);
      },
      error: () => this.saldoInicial.set(0)
    });
  }

  registrarAjusteAutocalculado() {
    const diff = this.diferencia();
    if (diff === null || diff === 0) return;

    const url = `${environment.apiBaseUrl}/pedidos/ajustar-caja`;

    this.http.put(url, { monto: diff }).subscribe({
      next: () => {
        this.ajustesHoy.update(a => a + diff);
        this.toast.success('Ajuste de caja registrado correctamente.');
        this.preguntarCierre();
      },
      error: (err) => {
        const msg = err.error?.mensaje || 'Error al registrar el ajuste de caja.';
        this.toast.error(msg);
      }
    });
  }

  preguntarCierre() {
    if (confirm('Ajuste registrado. ¿Querés cerrar la caja ahora?')) {
      this.cerrarCajaDelDia();
    }
  }

  cerrarCajaDelDia() {
    if (confirm('¿Estás seguro de que deseas cerrar la caja del día? Esta acción bloqueará el turno.')) {
      console.log('Caja diaria cerrada de forma definitiva.');
      this.tiendaService.cerrarCaja().subscribe(()=>{
        this.toast.success("Caja cerrada correctamente.")
        this.toast.warning("Caja cerrada. No se podrán realizar más movimiento en efectivo por el resto del día.",10000)//10secs
        this.pedidoService.verificarEstadoCaja();
      });
    }
  }
}
