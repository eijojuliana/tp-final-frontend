import { Component, computed, inject, OnInit } from '@angular/core';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria-service';
import { TiendaService } from '../../../services/tienda-service';
import { Router, RouterLink } from '@angular/router';
import { CuentaBancaria } from '../../../models/cuentaBancaria.model';
import { ToastService } from '../../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cuentas-bancarias-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './cuentas-bancarias-list.html',
  styleUrl: './cuentas-bancarias-list.css',
})
export class CuentasBancariasList implements OnInit {
  private cuentaBancariaService = inject(CuentaBancariaService);
  private tiendaService = inject(TiendaService);
  private router = inject(Router);
  private toast = inject(ToastService);

  public cuentasBancarias = this.cuentaBancariaService.cuentasBancarias;

  ngOnInit() {
    this.tiendaService.load();
  }

  efectivoEnCaja = computed(() => {
    const tienda = this.tiendaService.tienda();
    return tienda ? tienda.caja : 0;
  });

  saldoEnCuentas = computed(() => {
    return this.cuentasBancarias().reduce((total, c) => total + (c.saldo || 0), 0);
  });

  totalDisponible = computed(() => {
    return this.efectivoEnCaja() + this.saldoEnCuentas();
  });

  deleteCuentaBancaria(id: number) {
    if (confirm("¿Desea eliminar?")) {
      this.cuentaBancariaService.delete(id).subscribe({
        next: () => {
          this.toast.success("Cuenta Bancaria eliminada correctamente");
        }
      });
    }
  }

  updateCuentaBancaria(cuentaBancaria: CuentaBancaria) {
    this.cuentaBancariaService.selectCuentaBancariaToEdit(cuentaBancaria);
    this.router.navigate(['menu/cuentas-bancarias/form']);
  }

  exportarExcel() {
    this.cuentaBancariaService.exportarExcel();
  }
}
