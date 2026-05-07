import { Empleado, NewEmpleado } from './../models/empleado.model';
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { filter, Observable, tap } from 'rxjs';
import { environment } from './ip';


@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private url= environment.apiBaseUrl + "/empleados";
  private state=signal<Empleado[]>([]);
  private empleadoToEditToState=signal<Empleado | null> (null);
  public empleados=this.state.asReadonly();
  public empleadoToEdit=this.empleadoToEditToState.asReadonly();

  constructor(private http:HttpClient){
    this.load()
  }

  load(){
    this.http.get<Empleado[]>(this.url).subscribe(
      data => this.state.set(data)
    )
  }

  post(empleado:NewEmpleado): Observable<Empleado>{
    return this.http.post<Empleado>(this.url,empleado).pipe(
      tap( () => this.load() )
    );
  }

  delete(id:number): Observable<Empleado>{
    return this.http.delete<Empleado>(`${this.url}/${id}`).pipe(
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
    return this.http.put<Empleado>(`${this.url}/${empleado.empleadoId}`,empleado).pipe(
     tap( () => this.load() )
    );
  }

  selectEmpleadoToEdit(empleado:Empleado){
    this.empleadoToEditToState.set(empleado);
  }

  clearEmpleadoToEdit(){
    this.empleadoToEditToState.set(null);
  }

  exportarExcel() {
    return this.http.get(`${this.url}/exportar`, {
      responseType: 'blob'
    }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte-personas.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
