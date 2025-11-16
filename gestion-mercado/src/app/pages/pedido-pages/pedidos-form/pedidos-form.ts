import { Component, effect, inject, signal } from '@angular/core';
import { PedidoService } from '../../../services/pedido-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewPedido, Pedido } from '../../../models/pedido.model';
import { ProveedorService } from '../../../services/proveedor-service';

@Component({
  selector: 'app-pedidos-form',
  imports: [ReactiveFormsModule],
  templateUrl: './pedidos-form.html',
  styleUrl: './pedidos-form.css',
})
export class PedidosForm {
  private fb = inject(FormBuilder);
  pedidoService = inject(PedidoService);
  private router = inject(Router);

  //Para seleccionar el proveedor facilmente
  private proveedorService = inject(ProveedorService);
  public proveedores = this.proveedorService.proveedores;

  isEditMode = signal(false);
  private pedidoToEdit: Pedido | null = null;

  form = this.fb.nonNullable.group({
    tipoPedido: [undefined as unknown as 'COMPRA' | 'VENTA', [Validators.required]],
    tipoTransaccion: [undefined as unknown as 'EFECTIVO' | 'DEBITO', [Validators.required]],
    origen_id: [],
    destino_id: [0, [Validators.required]],
  });

  constructor() {
    effect(() => {
      this.pedidoToEdit = this.pedidoService.pedidoToEdit();

      if (this.pedidoToEdit) {
        this.isEditMode.set(true);
        this.form.patchValue({
          tipoPedido: this.pedidoToEdit.tipo,
        });
      } else {
        this.isEditMode.set(false);
        this.form.reset();
      }
    });
  }

  savePedido() {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();
    const dto: NewPedido = {
      tipo: formValue.tipoPedido,
      transaccion: {
        tipo: formValue.tipoTransaccion,
        origen_id: formValue.origen_id,
        destino_id: formValue.destino_id,
      },
    };

    if (this.isEditMode() && this.pedidoToEdit) {
      const updatedPedido = { ...this.pedidoToEdit, ...formValue };
      this.pedidoService.update(updatedPedido).subscribe(() => {
        console.log('Pedidoo Actualizado');
        this.pedidoService.clearPedidoToEdit();
      });
    } else {
      this.pedidoService.post(dto).subscribe(() => {
        console.log('Pedido Registrado');
        this.form.reset();
      });
    }
    this.router.navigate(['/menu/pedidos']);
  }

  cancelEdit() {
    this.pedidoService.clearPedidoToEdit();
    this.router.navigate(['/menu/pedidos']);
  }
}
