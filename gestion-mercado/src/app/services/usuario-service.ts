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

  private usuarioToEditState=signal<Usuario|null>(null);
  public usuarioToEdit=this.usuarioToEditState.asReadonly();

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

  delete(id:number):Observable<Usuario>{
      return this.http.delete<Usuario>(`${this.url}/${id}`).pipe(
        tap(()=> {
          this.usuariosState.update(currentUsuario =>
            currentUsuario.filter(usuario => usuario.usuarioId !== id )
          )
        })
      );
    }

    update (usuarioToUpdate:Usuario):Observable<Usuario>{
      return this.http.put<Usuario>(`${this.url}/${usuarioToUpdate.usuarioId}`,usuarioToUpdate).pipe(
        tap( () => this.load() )
      );
    }

    selectUsuarioToEdit(usuario:Usuario){
      this.usuarioToEditState.set(usuario);
    }

    clearUsuarioToEdit(){
      this.usuarioToEditState.set(null);
    }








}

