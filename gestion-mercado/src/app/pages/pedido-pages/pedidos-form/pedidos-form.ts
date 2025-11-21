import { Component, effect, inject, signal } from '@angular/core';
import { PedidoService } from '../../../services/pedido-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewPedido, Pedido } from '../../../models/pedido.model';
import { ProveedorService } from '../../../services/proveedor-service';
import { DetallesPedido } from "../../../components/detalles-pedido/detalles-pedido";
import { Transaccion } from '../../../models/transaccion.model';
import { ClienteService } from '../../../services/cliente-service';

@Component({
  selector: 'app-pedidos-form',
  imports: [ReactiveFormsModule, DetallesPedido],
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

  //Para clientes
  private clientesService=inject(ClienteService);
  public clientes=this.clientesService.clientes;
  isEditMode = signal(false);
  public pedidoToEdit: Pedido | null = null;

  //Signal para almacenar el ID del pedido recién creado
  pedidoCreado = signal<Pedido | null>(null);

  form = this.fb.nonNullable.group({
    tipoPedido: [undefined as unknown as 'COMPRA' | 'VENTA', [Validators.required]],
    tipoTransaccion: [undefined as unknown as 'EFECTIVO' | 'DEBITO', [Validators.required]],
    origen_id: [null as number | null],
    destino_id:[null as number | null, [Validators.min(0)]],
  });

  constructor() {
    effect(() => {
      this.pedidoToEdit = this.pedidoService.pedidoToEdit();

      if (this.pedidoToEdit) {
        this.isEditMode.set(true);
        this.pedidoCreado.set(this.pedidoToEdit);

        this.form.patchValue({
          tipoPedido: this.pedidoToEdit.tipo,
          tipoTransaccion: this.pedidoToEdit.transaccion?.tipo as 'EFECTIVO' | 'DEBITO',
          origen_id: this.pedidoToEdit.transaccion?.origen_id,
          destino_id: this.pedidoToEdit.transaccion?.destino_id
        });
      } else {
        this.isEditMode.set(false);
        if (this.pedidoCreado() === null) {
          this.form.reset();
        }
      }
    });
  }

  savePedido() {
    if (this.pedidoCreado()) return;
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();

    const tipoPedido = formValue.tipoPedido;

    let finalOrigenId: number | null = formValue.origen_id;
    let finalDestinoId: number = formValue.destino_id as number;

    const TIENDA_ID = 1;

    if (tipoPedido === 'COMPRA' && formValue.tipoTransaccion === 'EFECTIVO') {
      finalOrigenId = TIENDA_ID;
    }
    if (tipoPedido === 'VENTA') {
      // VENTA: Destino es la Tienda (ID fijo). Origen es el Cliente (del input).
      finalDestinoId = TIENDA_ID;
      finalOrigenId = formValue.origen_id;
    } else if (tipoPedido === 'COMPRA') {
      // COMPRA: Origen es la Tienda (ID fijo). Destino es el Proveedor (del select).
      finalOrigenId = TIENDA_ID;
      finalDestinoId = formValue.destino_id as number;
    }

    const dto: NewPedido = {
      tipo: formValue.tipoPedido,
      transaccion: {
        tipo: formValue.tipoTransaccion as 'EFECTIVO' | 'DEBITO',
        origen_id: finalOrigenId,
        destino_id: finalDestinoId,
      },
    };

    if (this.isEditMode() && this.pedidoToEdit) {
      const updatedTransaccion: Transaccion = {
        transaccion_id: this.pedidoToEdit.transaccion.transaccion_id,
        tipo: formValue.tipoTransaccion as 'EFECTIVO' | 'DEBITO',
          origen_id: finalOrigenId,
        destino_id: finalDestinoId,
        fecha: this.pedidoToEdit.transaccion.fecha,
        monto: this.pedidoToEdit.transaccion.monto,
      };
      const updatedPedido: Pedido = {
        pedidoId: this.pedidoToEdit.pedidoId,
        tipo: formValue.tipoPedido,
        transaccion: updatedTransaccion,
        detalles: this.pedidoToEdit.detalles,
      };

      this.pedidoService.update(updatedPedido).subscribe(() => {
        console.log('Pedidoo Actualizado');
        this.pedidoService.clearPedidoToEdit();
        this.router.navigate(['/menu/pedidos']);
      });
    } else {
      this.pedidoService.post(dto).subscribe((pedidoCreado) => {
        if (pedidoCreado) {
          console.log('Pedido Registrado con ID:', pedidoCreado.pedidoId);
          this.pedidoCreado.set(pedidoCreado); // Guardamos el ID para la seccion de detalles
        } else {
          console.error('Error al registrar el pedido.');
          this.pedidoCreado.set(null);
        }
      });
    }
  }

  cancelEdit() {
    this.pedidoService.clearPedidoToEdit();
    this.router.navigate(['/menu/pedidos']);
  }

  cancelarCreacion() {
    this.pedidoCreado.set(null);
    this.form.reset();
    this.router.navigate(['/menu/pedidos']);
  }
}
