import { Empleado, NewEmpleado } from './../models/empleado.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { filter, Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private apiurl='http://localhost:8080/api/empleados'
  private state=signal<Empleado[]>([]);
  private empleadoToEditToState=signal<Empleado | null> (null);
  public empleados=this.state.asReadonly();

  constructor(private httpClient:HttpClient){
    this.load()
  }

  load(){
    this.httpClient.get<Empleado[]>(this.apiurl).subscribe(
      data => this.state.set(data)
    )
  }

  agregar(empleado:NewEmpleado): Observable<Empleado>{
    return this.httpClient.post<Empleado>(this.apiurl,empleado).pipe(
      tap( () => this.load() )
    );
  }

  eliminar(id:number): Observable<Empleado>{
    return this.httpClient.delete<Empleado>(`${this.apiurl} / ${id}`).pipe(
      tap(
        () => this.state.update(currentEmpleado =>
          currentEmpleado.filter(empleado =>
            empleado.empleadoId != id
          )
        )
      )
    )
  }

  update(empleado :Empleado): Observable<Empleado>{
    return this.httpClient.put<Empleado>(`${this.apiurl} / ${empleado.empleadoId}`,empleado).pipe(
     tap( () => this.load() )
    );
  }

  selectEmpleadoToEdit(empleado:Empleado){
    this.empleadoToEditToState.set(empleado);
  }

  clearEmpleadoToEdit(){
    this.empleadoToEditToState.set(null);
  }
}
