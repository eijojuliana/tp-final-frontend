import { Injectable, Injector, signal } from '@angular/core';
import { Duenio, NewDuenio } from '../models/duenio.model';
import { HttpClient } from '@angular/common/http';
import { filter, first, map, Observable, tap } from 'rxjs';
import { environment } from './ip';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DuenioService {

  private url = environment.apiBaseUrl + "/duenios";

  private dueniosState = signal<Duenio[]>([]);
  public duenios = this.dueniosState.asReadonly();

  private duenioToEditState=signal<Duenio | null>(null);
  public duenioToEdit=this.duenioToEditState.asReadonly();

  private loadedState = signal<boolean>(false);

  constructor(private http: HttpClient, private injector:Injector,private auth:AuthService){

    const rol = this.auth.getRole();


  if (!rol || rol === 'ADMIN' || rol === 'DUENIO') {

    this.load();
  }

  }

load(): void {
    this.http.get<Duenio[]>(this.url).pipe(
      tap(data => {
        this.dueniosState.set(data);
        this.loadedState.set(true);
      })
    ).subscribe();
  }

  public get loaded$(): Observable<boolean> {
    return toObservable(this.loadedState, { injector: this.injector }).pipe(
      filter(isLoaded => isLoaded === true),
      first()
    );
  }

  public get hayDuenios(): boolean {
    return this.duenios().length > 0;
  }

  post(duenio:NewDuenio) :Observable<Duenio>{
    return this.http.post<Duenio>(this.url,duenio).pipe(
      tap( () => this.load() )
    );
  }

  delete(id:number):Observable<Duenio>{
    return this.http.delete<Duenio>(`${this.url}/${id}`).pipe(
      tap(()=> {
        this.dueniosState.update(currentDuenio =>
          currentDuenio.filter(duenio => duenio.duenioId !== id )
        )
      })
    );
  }

  update (duenioToUpdate:Duenio):Observable<Duenio>{
    return this.http.put<Duenio>(`${this.url}/${duenioToUpdate.duenioId}`,duenioToUpdate).pipe(
      tap( () => this.load() )
    );
  }

  selectDuenioToEdit(duenio:Duenio){
    this.duenioToEditState.set(duenio);
  }

  clearDuenioToEdit(){
    this.duenioToEditState.set(null);
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
