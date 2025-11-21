export interface Producto {
  producto_id: number,
  nombre: string,
  categoria: string,
  url?: string
}

export interface nuevoProducto {
  nombre: string,
  categoria: string,
  url?: string
}
