export interface Domicilio {
  calle?: string;
  altura?: string;
  piso?: string;
  codigopostal?: string;
  localidad?: string;
  provincia?: string;
  pais?: string;
}

export interface Tienda {
  tiendaId: number;
  razonSocial: string;
  nombreFantasia?: string;
  cuit: number;
  condicion: string;
  ingresosBrutos?: string;
  fechaInicioActividades?: string;
  puntoDeVenta: number;
  direccion?: Domicilio;
  caja: number;
  duenioDni: number;
}

export interface newTienda {
  razonSocial: string;
  nombreFantasia?: string;
  cuit: number;
  condicion: string;
  ingresosBrutos?: string;
  fechaInicioActividades?: string;
  puntoDeVenta: number;
  direccion?: Domicilio;
  caja: number;
  duenioDni: number;
}

