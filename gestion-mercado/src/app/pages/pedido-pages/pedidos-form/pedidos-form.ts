import { Component, effect, inject, signal, OnInit } from '@angular/core';
import { PedidoService } from '../../../services/pedido-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { NewPedido, Pedido } from '../../../models/pedido.model';
import { ProveedorService } from '../../../services/proveedor-service';
import { DetallesPedido } from "../../../components/detalles-pedido/detalles-pedido";
import { NewTransaccion } from '../../../models/transaccion.model';
import { ClienteService } from '../../../services/cliente-service';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria-service';
import { TransaccionService } from '../../../services/transaccion-service';
import { ToastService } from '../../../services/toast.service';
import { DetallePedidoService } from '../../../services/detallePedido-service';
import { BuscadorGenericoComponent } from '../../../components/buscador/buscador';
import { BuscadorItem } from '../../../components/buscador/buscador-item';
import { PedidoPersistenceService } from '../../../services/pedido-persistence-service';

@Component({
  selector: 'app-pedidos-form',
  imports: [ReactiveFormsModule, DetallesPedido, BuscadorGenericoComponent],
  templateUrl: './pedidos-form.html',
  styleUrl: './pedidos-form.css',
})
export class PedidosForm implements OnInit {
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);
  private persistenceService = inject(PedidoPersistenceService);
  pedidoService = inject(PedidoService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private proveedorService = inject(ProveedorService);
  public proveedores = this.proveedorService.proveedores;

  private clientesService = inject(ClienteService);
  public clientes = this.clientesService.clientes;

  private cuentaService = inject(CuentaBancariaService);
  public cuentasBancarias = this.cuentaService.cuentasBancarias;

  private transaccionService = inject(TransaccionService);
  private detallePedidoService = inject(DetallePedidoService);

  isEditMode = signal(false);
  public pedidoToEdit: Pedido | null = null;
  pedidoCreado = signal<Pedido | null>(null);
  showModal = signal(false);

  get proveedoresMapeados(): BuscadorItem[] {
    return this.proveedores().map(p => ({
      id: p.proveedorId,
      textoPrincipal: p.razonSocial,
      subtexto: `Tel: ${p.telefono || ''}`
    }));
  }

  get clientesMapeados(): BuscadorItem[] {
    return this.clientes().map(c => ({
      id: c.clienteId,
      textoPrincipal: `${c.nombre} ${c.apellido}`,
      subtexto: `DNI: ${c.dni || ''}`
    }));
  }

  form = this.fb.nonNullable.group({
    tipoPedido: [undefined as unknown as 'COMPRA' | 'VENTA', [Validators.required]],
    tipoTransaccion: [undefined as unknown as 'EFECTIVO' | 'TRANSFERENCIA', [Validators.required]],
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
    const savedData = this.persistenceService.getState();
    if (savedData) {
      this.form.patchValue(savedData);
      this.persistenceService.clearState();
    }

    this.pedidoService.verificarEstadoCaja();
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
      } else if (!savedData) {
        this.isEditMode.set(false);
        this.pedidoCreado.set(null);
        this.form.reset();
        this.form.enable();
      }
    });
  }

  public irAProveedor() {
    this.persistenceService.saveState(this.form.getRawValue());
    this.router.navigate([`/menu/proveedores/form`]);
  }

    public irACliente() {
    this.persistenceService.saveState(this.form.getRawValue());
    this.router.navigate([`/menu/clientes/form`]);
  }

  public alSeleccionarProveedor(id: number | string): void {

    this.form.get('destino_id')?.setValue(id as number);
    this.form.get('destino_id')?.markAsTouched();
  }

  public alSeleccionarCliente(id: number | string): void {
    this.form.get('origen_id')?.setValue(id as number);
    this.form.get('origen_id')?.markAsTouched();
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
      tipoTransaccion: this.pedidoToEdit.transaccion?.tipo as 'EFECTIVO' | 'TRANSFERENCIA',
      origen_id: this.pedidoToEdit.transaccion?.origen_id,
      destino_id: this.pedidoToEdit.transaccion?.destino_id,
      cuentaBancaria: this.pedidoToEdit.transaccion?.origen_id,
    });
  }

  savePedido() {
    if (this.form.invalid) return;
    const formValue = this.form.getRawValue();
    const tipoPedido = formValue.tipoPedido;
    const tipoTransaccion = this.form.get('tipoTransaccion')?.value;

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
    if (formValue.tipoTransaccion === 'TRANSFERENCIA' && formValue.cuentaBancaria) {
      if(tipoPedido ==='COMPRA'){
        finalOrigenId=formValue.cuentaBancaria;
      }
      else if(tipoPedido ==='VENTA'){
        finalDestinoId=formValue.cuentaBancaria;
      }
    }

    const destinoIdValue = finalDestinoId !== null ? finalDestinoId : (formValue.destino_id as number);
    const origenIdValue = finalOrigenId;

    //Verificación de q no se haya cerrado la caja
    if (this.pedidoService.isCajaCerradaHoy()) {
      if (tipoTransaccion === 'EFECTIVO') {
        this.toast.error('Operación denegada: La caja física de hoy ya se encuentra cerrada.');
        return;
      }
    }

    const dto: NewPedido = {
      tipo: formValue.tipoPedido,
      transaccion: {
        tipo: formValue.tipoTransaccion as 'EFECTIVO' | 'TRANSFERENCIA',
        origen_id: origenIdValue,
        destino_id: destinoIdValue,
      },
    };

    if (this.isEditMode() && this.pedidoToEdit) {
      const id = this.pedidoToEdit.pedidoId;
      const updateDto: NewPedido = {
        tipo: dto.tipo,
        transaccion: {...dto.transaccion, transaccion_id: this.pedidoToEdit.transaccion.transaccion_id
        } as NewTransaccion
      };
      this.pedidoService.update(updateDto,id).subscribe(() => {
        this.pedidoService.clearPedidoToEdit();
        this.router.navigate(['/menu/pedidos']);
      });
    } else {
      this.pedidoService.post(dto).subscribe((pedidoCreado) => {
        if (pedidoCreado) {
          this.pedidoCreado.set(pedidoCreado);
          this.showModal.set(true);
        } else {
          this.pedidoCreado.set(null);
        }
      });
    }
  }

  cancelEdit() {
    this.pedidoService.clearPedidoToEdit();
    this.router.navigate(['/menu/pedidos']);
  }

public eliminarPedido(id: number) {
  if (confirm('¿Desea eliminar este pedido permanentemente?')) {
    this.pedidoService.delete(id).subscribe({
      next: () => {
        this.pedidoService.clearPedidoToEdit();
        this.router.navigate(['/menu/pedidos']);
      }
    });
  }
}

  finalizarPedido() {
    const pedido = this.pedidoCreado();
    if (!pedido) return;
    this.detallePedidoService.load(pedido.pedidoId).subscribe({
      next: (detalles) => {
        if (!detalles || detalles.length === 0) {
          this.toast.error('El detalle no puede estar vacío');
          return;
        }
        if (confirm('¿Desea finalizar el pedido?')) {
          this.pedidoService.finalizar(pedido.pedidoId).subscribe({
            next: () => {
              this.pedidoService.clearPedidoToEdit();
              this.transaccionService.load();
              this.router.navigate(['/menu/pedidos']);
            }
          });
        }
      }
    });
  }

  formCollapsed = signal(true);
  toggleForm() {
    if (window.matchMedia('(max-aspect-ratio: 1/1)').matches) {
      this.formCollapsed.update(v => !v);
    }
  }

  cerrarModal() {
    this.showModal.set(false);
  }
}
