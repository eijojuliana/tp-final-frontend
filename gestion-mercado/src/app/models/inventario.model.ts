export interface Inventario {
  inventario_id: number;
  cantidad: number;
  producto_id: number;
  stockMin: number;
  precioVenta: number;
  costoAdquisicion: number;
}

export interface newInventario {
  cantidad: number;
  producto_id: number;
  stockMin: number;
  precioVenta: number;
  costoAdquisicion: number;
}
