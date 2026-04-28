import { Domicilio } from "./domicilio.model";

export interface Proveedor {
  proveedorId:number;
  cuit: number;
  razonSocial: string;
  nombreFantasia?: string;
  condicion: string;
  direccion?: Domicilio;
  telefono?: number;
  email?: string;
}

export interface NewProveedor {
  cuit: number;
  razonSocial: string;
  nombreFantasia?: string;
  condicion: string;
  direccion?: Domicilio;
  telefono?: number;
  email?: string;
}
