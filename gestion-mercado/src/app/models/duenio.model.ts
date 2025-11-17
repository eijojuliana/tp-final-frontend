import { NewPersona, Persona } from "./persona.model";


export interface Duenio extends Persona {
  duenioId: number,
  email: string
}

export interface NewDuenio extends NewPersona{
  email:string,
  contraseña:string
}
