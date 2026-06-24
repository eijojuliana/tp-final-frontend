import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewTransaccion } from '../../../models/transaccion.model';
import { Router, RouterLink } from '@angular/router';
import { TransaccionService } from '../../../services/transaccion-service';
import { ToastService } from '../../../services/toast.service';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria-service';

@Component({
  selector: 'app-transaccion-form',
  imports: [ReactiveFormsModule, RouterLink, DecimalPipe],
  templateUrl: './transaccion-form.html',
  styleUrl: './transaccion-form.css',
})
export class TransaccionForm implements OnInit {
  private service = inject(TransaccionService);
  private cuentaBancariaService = inject(CuentaBancariaService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toast = inject(ToastService);

  cuentasBancarias = this.cuentaBancariaService.cuentasBancarias;
  loadingCuentas = signal(true);

  tipoMovimiento = signal<'INGRESO_MANUAL' | 'EGRESO_MANUAL'>('INGRESO_MANUAL');

  form = this.fb.nonNullable.group({
    tipo: ['INGRESO_MANUAL', Validators.required],
    monto: [0, [Validators.required, Validators.min(0.01)]],
    motivo: ['', Validators.required],
    destinoId: [1, Validators.required],
  });

  ngOnInit() {
    this.cuentaBancariaService.load();
    setTimeout(() => this.loadingCuentas.set(false), 3000);
  }

  onTipoChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'INGRESO_MANUAL' | 'EGRESO_MANUAL';
    this.tipoMovimiento.set(value);
    this.form.patchValue({ tipo: value });
  }

  saveMovimiento() {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();
    const esIngreso = raw.tipo === 'INGRESO_MANUAL';

    const movimiento: NewTransaccion = {
      tipo: raw.tipo as 'INGRESO_MANUAL' | 'EGRESO_MANUAL',
      monto: raw.monto,
      motivo: raw.motivo,
      origen_id: esIngreso ? undefined : raw.destinoId,
      destino_id: raw.destinoId,
    };

    this.service.registrarMovimiento(movimiento).subscribe({
      next: () => {
        const label = esIngreso ? 'Ingreso' : 'Egreso';
        this.toast.success(`${label} registrado correctamente`);
        this.form.reset({ tipo: 'INGRESO_MANUAL', monto: 0, motivo: '', destinoId: 1 });
        this.tipoMovimiento.set('INGRESO_MANUAL');
        this.router.navigate(['/menu/transacciones']);
      }
    });
  }
}
