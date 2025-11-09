import { Producto } from "./producto.model";

export interface Lote {
  lote_id: number,
  producto: Producto,
  cantidadDisponible: number,
  costoUnitario: number,
  fechaIngreso: string;
}

export interface newLote {
  producto: Producto,
  cantidadDisponible: number,
  costoUnitario: number,
  fechaIngreso: string;
}
