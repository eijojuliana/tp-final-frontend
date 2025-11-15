import { NewPersona, Persona } from "./persona.model";

export interface Cliente extends Persona{
  clienteId:number;
}

export interface NewCliente extends NewPersona{
  
}
