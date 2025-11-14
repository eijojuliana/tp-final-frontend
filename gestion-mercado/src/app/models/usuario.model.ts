export interface Usuario {
  usuarioId: number,
  email: string,
  contraseña: string,
  rol: string
}
export interface NewUsuario {
  email: string,
  contraseña?: string,
  rol: string
}
