export interface DetallePedido {
  detallePedidoId:number,
  producto_id: number,
  producto_nombre: string,
  cantidad: number,
  costoUnitarioCompra?: number,
  subtotal: number
}

export interface NewDetallePedido {
  productoId: number,
  cantidad: number,
  costoUnitarioCompra: number
}
