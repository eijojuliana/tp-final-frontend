import { Empleado, NewEmpleado } from './../models/empleado.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { filter, Observable, tap } from 'rxjs';
import { environment } from './ip';


@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private apiurl= environment.apiBaseUrl + "/empleados";
  private state=signal<Empleado[]>([]);
  private empleadoToEditToState=signal<Empleado | null> (null);
  public empleados=this.state.asReadonly();
  public empleadoToEdit=this.empleadoToEditToState.asReadonly();

  constructor(private httpClient:HttpClient){
    this.load()
  }

  load(){
    this.httpClient.get<Empleado[]>(this.apiurl).subscribe(
      data => this.state.set(data)
    )
  }

  post(empleado:NewEmpleado): Observable<Empleado>{
    return this.httpClient.post<Empleado>(this.apiurl,empleado).pipe(
      tap( () => this.load() )
    );
  }

  delete(id:number): Observable<Empleado>{
    return this.httpClient.delete<Empleado>(`${this.apiurl}/${id}`).pipe(
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
    return this.httpClient.put<Empleado>(`${this.apiurl}/${empleado.empleadoId}`,empleado).pipe(
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
