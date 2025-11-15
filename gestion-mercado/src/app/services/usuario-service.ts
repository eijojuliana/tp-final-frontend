import { Usuario, NewUsuario } from './../models/usuario.model';
import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url = "http://localhost:8080/api/usuarios"

  private usuariosState = signal<Usuario[]>([]);
  public usuarios = this.usuariosState.asReadonly();

  constructor(private http:HttpClient){
    this.load();
  }

  load(){
    this.http.get<Usuario[]>(this.url).subscribe(
      data => this.usuariosState.set(data)
    );
  }

  post(usuario:NewUsuario):Observable<Usuario>{
    return this.http.post<Usuario>(this.url,usuario).pipe(
      tap( () => this.load() )
    );
  }
}

