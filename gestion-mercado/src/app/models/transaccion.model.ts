export interface Transaccion {
  transaccion_id: number,
  tipo: string,
  fecha: Date,
  monto: number,
  origen_id: number,
  destino_id: number,
}

export interface NewTransaccion {
  tipo: string,
  fecha?: Date,
  monto?: number,
  origen_id?: number,
  destino_id: number,
}
