import { Producto } from "./producto.model";

export interface Lote {
  lote_id: number,
  producto: Producto,
  cantidadDisponible: number,
  costoUnitario: number,
  fechaIngreso: string;
}

export interface newLote {
  producto: {
    nombre: string;
    categoria: string;
  };
  cantidadDisponible: number;
  costoUnitario: number;
  fechaIngreso: string;
}
