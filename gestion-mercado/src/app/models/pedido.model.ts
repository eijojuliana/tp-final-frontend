import { DetallePedido, NewDetallePedido } from "./detallePedido.model";
import { NewTransaccion, Transaccion } from "./transaccion.model";

export interface Pedido {
    pedidoId: number;
    transaccion: Transaccion;
    tipo: 'VENTA' | 'COMPRA';
    detalles: DetallePedido[];
    estado: 'PENDIENTE' | 'FINALIZADO';
}

export interface NewPedido {
    tipo: 'VENTA' | 'COMPRA';
    transaccion: NewTransaccion;
}
