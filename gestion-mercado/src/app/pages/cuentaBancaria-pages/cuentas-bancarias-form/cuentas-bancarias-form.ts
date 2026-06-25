import { CuentaBancaria, newCuentaBancaria } from './../../../models/cuentaBancaria.model';
import { Component, effect, inject, signal } from '@angular/core';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria-service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { PedidoPersistenceService } from '../../../services/pedido-persistence-service';

@Component({
  selector: 'app-cuentas-bancarias-form',
  imports: [ReactiveFormsModule],
  templateUrl: './cuentas-bancarias-form.html',
  styleUrl: './cuentas-bancarias-form.css',
})
export class CuentasBancariasForm {
  private cuentaBancariaService = inject(CuentaBancariaService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toast = inject(ToastService);
  private persistenceService = inject(PedidoPersistenceService);

  public isEditMode = signal(false);
  private cuentaBancariaToEdit: CuentaBancaria | null = null

  form = this.fb.nonNullable.group({
    nombreBanco:['',[Validators.required]],
    cbu: ['', [Validators.required, Validators.pattern('^\\d{22}$')]],
    saldo: [0, [Validators.required]]
  });

  constructor() {
    effect(() => {
      this.cuentaBancariaToEdit = this.cuentaBancariaService.cuentaBancariaToEdit();

      if(this.cuentaBancariaToEdit) {
        this.isEditMode.set(true);
        this.form.patchValue({
          nombreBanco:this.cuentaBancariaToEdit.nombreBanco,
          cbu: this.cuentaBancariaToEdit.cbu,
          saldo: this.cuentaBancariaToEdit.saldo
        });
      } else {
        this.isEditMode.set(false);
        this.form.reset();
      }
    })
  }

  saveCuentaBancaria() {
    if(this.form.invalid) return;

    const nuevosValores: newCuentaBancaria = this.form.getRawValue();

    if(this.isEditMode() && this.cuentaBancariaToEdit) {

      const cuentaBancariaUpdated = { ...this.cuentaBancariaToEdit, ...nuevosValores };

      this.cuentaBancariaService.update(cuentaBancariaUpdated).subscribe({
        next: () => {
          console.log("Cuenta Bancaria Actualizada");
          this.toast.success("Cuenta Bancaria Actualizada");
          this.form.reset();
          this.router.navigate(['/menu/cuentas-bancarias']);
        }
      });
    } else {
      console.log(nuevosValores);
      this.cuentaBancariaService.post(nuevosValores).subscribe({
        next: () => {
          this.toast.success("Cuenta Bancaria Registrada con éxito");
          this.form.reset();
          const estadoPedido = this.persistenceService.getState();
          if (estadoPedido) {
            this.router.navigate(['/menu/pedidos/form']);
          } else {
            this.router.navigate(['/menu/cuentas-bancarias']);
          }
        }
      });
    }
  }


  cancelarUpdate() {
    this.cuentaBancariaService.clearCuentaBancariaToEdit();
  }
}
