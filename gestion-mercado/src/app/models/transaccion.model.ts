export interface Transaccion {
  transaccion_id: number,
  tipo: string,
  fecha: Date | string,
  monto: number,
  origen_id: number | null,
  destino_id: number,
  motivo?: string,
}

export interface NewTransaccion {
  tipo: 'EFECTIVO' | 'TRANSFERENCIA' | 'INGRESO_MANUAL' | 'EGRESO_MANUAL',
  monto?: number,
  origen_id?: number | null | undefined,
  destino_id?: number,
  motivo?: string,
}
