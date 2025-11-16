import { Component, computed, inject, signal } from '@angular/core';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria-service';
import { Router, RouterLink } from '@angular/router';
import { CuentaBancaria } from '../../../models/cuentaBancaria.model';

@Component({
  selector: 'app-cuentas-bancarias-list',
  imports: [RouterLink],
  templateUrl: './cuentas-bancarias-list.html',
  styleUrl: './cuentas-bancarias-list.css',
})
export class CuentasBancariasList {
  private cuentaBancariaService = inject(CuentaBancariaService);
  private router = inject(Router);
  public cuentasBancarias = this.cuentaBancariaService.cuentasBancarias;

  filtro = signal('');
  atributo = signal<'cbu' | 'saldo'>('cbu');

  cuentasFiltradas = computed(() => {
    const f = this.filtro().toLowerCase().trim();
    const attr = this.atributo();

    return this.cuentasBancarias().filter(cb => {
      return String((cb as any)[attr]).toLowerCase().includes(f);
    });
  });

  deleteCuentaBancaria(id:number) {
    if(confirm("¿Desea eliminar?")) {
      this.cuentaBancariaService.delete(id).subscribe(() => {
        console.log(`Cuenta de ID: ${id} eliminada.`);
      })
    }
  }

  updateCuentaBancaria(cuentaBancaria:CuentaBancaria) {
    this.cuentaBancariaService.seleccionarCuentaBancariaToEdit(cuentaBancaria);
    this.router.navigate(['menu/cuentas-bancarias/form']);
  }
}
