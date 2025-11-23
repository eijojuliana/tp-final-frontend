import { Component, computed, inject, signal } from '@angular/core';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria-service';
import { Router, RouterLink } from '@angular/router';
import { CuentaBancaria } from '../../../models/cuentaBancaria.model';
import { ToastService } from '../../../services/toast.service';

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
  private toast = inject(ToastService);

  filtro = signal('');
  atributo = signal<'cbu' | 'saldo'>('cbu');
  orden = signal<'asc' | 'desc'>('asc');

  cuentasFiltradas = computed(() => {
    const filtro = this.filtro();
    const attr = this.atributo();
    const ord = this.orden();

    return this.cuentasBancarias()
      .filter(c => filtro ? String((c as any)[attr]).toLowerCase().includes(filtro.toLowerCase()) : true)
      .sort((a, b) => {
        const A = (a as any)[attr];
        const B = (b as any)[attr];

        if (typeof A === 'number' && typeof B === 'number') {
          return ord === 'asc' ? A - B : B - A;
        }

        return ord === 'asc'
          ? String(A).localeCompare(String(B))
          : String(B).localeCompare(String(A));
      });
  });

  deleteCuentaBancaria(id:number) {
    if(confirm("¿Desea eliminar?")) {
      this.cuentaBancariaService.delete(id).subscribe({
        next: () => {
        this.toast.success("Cuenta Bancaria eliminada correctamente");
        console.log(`Cuenta Bancaria con id: ${id} eliminada`);
      }
      })
    }
  }

  updateCuentaBancaria(cuentaBancaria:CuentaBancaria) {
    this.cuentaBancariaService.seleccionarCuentaBancariaToEdit(cuentaBancaria);
    this.router.navigate(['menu/cuentas-bancarias/form']);
  }
}
