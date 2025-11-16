import { NewPersona, Persona } from "./persona.model";

export interface Proveedor extends Persona{
  proveedorId:number;
}

export interface NewProveedor extends NewPersona{

}
