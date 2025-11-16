export interface DetallePedido {
  detallePedidoId:number,
  productoId: number,
  producto_nombre: string,
  cantidad: number,
  costoUnitarioCompra?: number
}

export interface NewDetallePedido {
  productoId: number,
  cantidad: number,
  costoUnitarioCompra?: number
}
