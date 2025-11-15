import { NewPersona, Persona } from "./persona.model";
import { NewUsuario } from "./usuario.model";

export interface Duenio extends Persona {
  duenioId: number,
  email: string
}

export interface NewDuenio extends NewPersona{
  usuario: NewUsuario
}
