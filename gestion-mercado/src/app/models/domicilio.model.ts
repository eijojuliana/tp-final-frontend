export interface Domicilio {
  calle?: string;
  altura?: string;
  piso?: string;
  codigoPostal?: string;
  localidad?: string;
  provincia?: string;
  pais: string;
}

export interface NewDomicilio extends Domicilio{
}
