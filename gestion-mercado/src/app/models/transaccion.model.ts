export interface Transaccion {
  transaccion_id: number,
  tipo: string,
  fecha: Date | string,
  monto: number,
  origen_id: number | null,
  destino_id: number,
}

export interface NewTransaccion {
  tipo: 'EFECTIVO' | 'DEBITO',
  origen_id?: number | null | undefined,
  destino_id: number,
}
