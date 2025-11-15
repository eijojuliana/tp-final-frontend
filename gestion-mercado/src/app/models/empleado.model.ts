import { Persona ,NewPersona } from "./persona.model"


export interface Empleado extends Persona{
  empleadoId:number,
  email:string
}

export interface NewEmpleado extends NewPersona{
  email:string
}
