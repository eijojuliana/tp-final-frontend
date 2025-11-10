export interface Inventario {
  inventario_id: number;
  cantidad: number;
  productoId: number;
  stockMin: number;
  precioVenta: number;
  costoAdquisicion: number;
}

export interface newInventario {
  cantidad: number;
  productoId: number;
  stockMin: number;
  precioVenta: number;
  costoAdquisicion: number;
}
