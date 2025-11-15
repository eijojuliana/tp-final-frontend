import { Injectable, signal } from '@angular/core';
import { Duenio, NewDuenio } from '../models/duenio.model';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DuenioService {

  private apiUrl = 'http://localhost:8080/api/duenios';

  private dueniosState = signal<Duenio[]>([]);
  public duenios = this.dueniosState.asReadonly();

  private duenioToEditState=signal<Duenio | null>(null);
  public duenioToEdit=this.duenioToEditState.asReadonly();


  constructor(private http: HttpClient){
    this.load();
  }


   load() {
    this.http.get<Duenio[]>(this.apiUrl).subscribe(
      data => {
        console.log(data)
        this.dueniosState.set(data)
      }
    );
  }

  post(duenio:NewDuenio) :Observable<Duenio>{
    return this.http.post<Duenio>(this.apiUrl,duenio).pipe(
      tap( () => this.load() )
    );
  }

  delete(id:number):Observable<Duenio>{
    return this.http.delete<Duenio>(`${this.apiUrl}/${id}`).pipe(
      tap(()=> {
        this.dueniosState.update(currentDuenio =>
          currentDuenio.filter(duenio => duenio.duenioId !== id )
        )
      })
    );
  }

  update (duenioToUpdate:Duenio):Observable<Duenio>{
    return this.http.put<Duenio>(`${this.apiUrl}/${duenioToUpdate.duenioId}`,duenioToUpdate).pipe(
      tap( () => this.load() )
    );
  }

  selectDuenioToEdit(duenio:Duenio){
    this.duenioToEditState.set(duenio);
  }

  clearDuenioToEdit(){
    this.duenioToEditState.set(null);
  }

}
