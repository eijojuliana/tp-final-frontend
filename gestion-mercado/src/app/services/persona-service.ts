import { newPersona } from './../models/persona.model';
import { Injectable, signal } from '@angular/core';
import { Persona } from '../models/persona.model';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonaService {

  private apiUrl = 'http://localhost:8080/api/personas';

  private personasState = signal<Persona[]>([]);
  public personas = this.personasState.asReadonly();

  private personaToEditState=signal<Persona | null>(null);
  public personaToEdit=this.personaToEditState.asReadonly();


  constructor(private http: HttpClient){
    this.load();
  }


   load() {
    this.http.get<Persona[]>(this.apiUrl).subscribe(
      data => {
        console.log(data)
        this.personasState.set(data)
      }
    );
  }

  post(persona:newPersona) :Observable<Persona>{
    return this.http.post<Persona>(this.apiUrl,persona).pipe(
    tap(newPersona =>{
       this.personasState.update(currentPersona => [...currentPersona,newPersona])
      })
    )
  }

  delete(id:number):Observable<Persona>{
    return this.http.delete<Persona>(`${this.apiUrl}/${id}`).pipe(
      tap(()=> {
        this.personasState.update(currentPersona =>
          currentPersona.filter(persona => persona.persona_id !== id )
        )
      })
    )
  }

  update (personaToUpdate:Persona):Observable<Persona>{
    return this.http.put<Persona>(`${this.apiUrl}/${personaToUpdate.persona_id}`,personaToUpdate).pipe(
      tap(updatedPersona => {
        this.personasState.update(currentPersona =>
             currentPersona.map(p=>
              p.persona_id=== updatedPersona.persona_id ? updatedPersona:p)
        )
      })
    )
  }

  selectPersonaToEdit(persona:Persona){
    this.personaToEditState.set(persona);
  }

  clearPersonaToEdit(){
    this.personaToEditState.set(null);
  }

}
