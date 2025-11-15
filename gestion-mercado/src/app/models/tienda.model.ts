export interface Tienda {
  tiendaId: number,
  nombre: string,
  direccion: string,
  caja: number,
  duenio: string,
}

export interface NewTienda {
  nombre: string,
  direccion: string,
  caja: number,
  duenioDni?: number,
}
