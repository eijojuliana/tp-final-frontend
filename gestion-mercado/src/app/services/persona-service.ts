import { Injectable, signal } from '@angular/core';
import { Persona } from '../models/persona.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PersonaService {

  private apiUrl = 'http://localhost:8080/api/personas';

  private personasState = signal<Persona[]>([]);
  public personas = this.personasState.asReadonly();


  constructor(private http: HttpClient){
    this.load();
  }


  private load() {
    this.http.get<Persona[]>(this.apiUrl).subscribe(
      data => {
        console.log(data)
        this.personasState.set(data)
      }
    );
  }


}
