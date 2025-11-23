import { Component, effect, inject, signal } from '@angular/core';
import { PedidoService } from '../../../services/pedido-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NewPedido, Pedido } from '../../../models/pedido.model';
import { ProveedorService } from '../../../services/proveedor-service';
import { DetallesPedido } from "../../../components/detalles-pedido/detalles-pedido";
import { NewTransaccion, Transaccion } from '../../../models/transaccion.model';
import { ClienteService } from '../../../services/cliente-service';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria-service';


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
  private activatedRoute = inject(ActivatedRoute);

  private proveedorService = inject(ProveedorService);
  public proveedores = this.proveedorService.proveedores;

  private clientesService = inject(ClienteService);
  public clientes = this.clientesService.clientes;

  private cuentaService = inject(CuentaBancariaService);
  public cuentasBancarias= this.cuentaService.cuentasBancarias;

  isEditMode = signal(false);
  public pedidoToEdit: Pedido | null = null;
  pedidoCreado = signal<Pedido | null>(null);

  form = this.fb.nonNullable.group({
    tipoPedido: [undefined as unknown as 'COMPRA' | 'VENTA', [Validators.required]],
    tipoTransaccion: [undefined as unknown as 'EFECTIVO' | 'DEBITO', [Validators.required]],
    origen_id: [null as number | null],
    destino_id: [null as number | null, [Validators.min(0)]],
    cuentaBancaria: [null as number | null],
  });

  constructor() {
    effect(() => {
      this.pedidoToEdit = this.pedidoService.pedidoToEdit();
      if (this.pedidoToEdit) {
        this.cargarDatosEnFormulario();
        this.pedidoCreado.set(this.pedidoToEdit);
      }
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.pedidoService.getById(Number(id)).subscribe({
          next: (pedido) => {
            this.pedidoService.selectPedidoToEdit(pedido);
            this.pedidoToEdit = pedido;
            this.cargarDatosEnFormulario();
            this.pedidoCreado.set(pedido);
          },
          error: (err) => console.error('Error al recuperar pedido', err)
        });
      } else {
        this.isEditMode.set(false);
        this.pedidoCreado.set(null);
        this.form.reset();
        this.form.enable();
      }
    });
  }

  cargarDatosEnFormulario() {
    if (!this.pedidoToEdit) return;

    this.isEditMode.set(true);

    if (this.pedidoToEdit.estado === 'FINALIZADO') {
      this.form.disable();
    } else {
      this.form.enable();
    }

    this.form.patchValue({
      tipoPedido: this.pedidoToEdit.tipo,
      tipoTransaccion: this.pedidoToEdit.transaccion?.tipo as 'EFECTIVO' | 'DEBITO',
      origen_id: this.pedidoToEdit.transaccion?.origen_id,
      destino_id: this.pedidoToEdit.transaccion?.destino_id,
      cuentaBancaria: this.pedidoToEdit.transaccion?.origen_id,
    });
  }

  savePedido() {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();
    const tipoPedido = formValue.tipoPedido;

    let finalOrigenId: number | null = formValue.origen_id;
    let finalDestinoId: number | null = formValue.destino_id;

    const TIENDA_ID = 1;

    if (tipoPedido === 'COMPRA' && formValue.tipoTransaccion === 'EFECTIVO') {
      finalOrigenId = TIENDA_ID;
    }

    if (tipoPedido === 'VENTA') {
      finalDestinoId = TIENDA_ID;
    } else if (tipoPedido === 'COMPRA') {
      finalOrigenId = TIENDA_ID;
      finalDestinoId = formValue.destino_id as number;
    }


    if (formValue.tipoTransaccion === 'DEBITO' && formValue.cuentaBancaria) {
      if(tipoPedido ==='COMPRA'){
        finalOrigenId=formValue.cuentaBancaria;
      }
      else if(tipoPedido ==='VENTA'){
        finalDestinoId=formValue.cuentaBancaria;
      }
    }

    const destinoIdValue = finalDestinoId !== null ? finalDestinoId : (formValue.destino_id as number);
    const origenIdValue = finalOrigenId;

    const dto: NewPedido = {
      tipo: formValue.tipoPedido,
      transaccion: {
        tipo: formValue.tipoTransaccion as 'EFECTIVO' | 'DEBITO',
        origen_id: origenIdValue,
        destino_id: destinoIdValue,
      },
    };

    if (this.isEditMode() && this.pedidoToEdit) {
      const id = this.pedidoToEdit.pedidoId;
      const updateDto: NewPedido = {
        tipo: dto.tipo,
        transaccion: {...dto.transaccion,transaccion_id: this.pedidoToEdit.transaccion.transaccion_id
        } as NewTransaccion
      };

      this.pedidoService.update(updateDto,id).subscribe(() => {
        console.log('Pedido Actualizado');
        this.pedidoService.clearPedidoToEdit();
        this.router.navigate(['/menu/pedidos']);
      });
    } else {
      this.pedidoService.post(dto).subscribe((pedidoCreado) => {
        if (pedidoCreado) {
          console.log('Pedido Registrado con ID:', pedidoCreado.pedidoId);
          this.pedidoCreado.set(pedidoCreado);
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

  finalizarPedido() {
    const pedido = this.pedidoCreado();
    if (!pedido) return;

    if (confirm('¿Desea finalizar el pedido? Una vez finalizado no podrá modificarse.')) {
      this.pedidoService.finalizar(pedido.pedidoId).subscribe({
        next: () => {
          console.log('Pedido Finalizado');
          this.pedidoService.clearPedidoToEdit(); // Limpiamos selección
          this.router.navigate(['/menu/pedidos']);
        },
        error: (e) => console.error('Error al finalizar:', e)
      });
    }
  }
}
