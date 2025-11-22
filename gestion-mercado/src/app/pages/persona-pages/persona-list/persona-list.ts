import { Component, computed, inject, signal } from '@angular/core';
import { PersonaService } from '../../../services/persona-service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-persona-list',
  imports: [],
  templateUrl: './persona-list.html',
  styleUrl: './persona-list.css',
})
export class PersonaList {

  personaService = inject(PersonaService);
  personas = this.personaService.personas;
  router=inject(Router);

  filtro = signal('');
  atributo = signal<'nombre' | 'dni'|'edad'>('nombre');
  orden = signal<'asc' | 'desc'>('asc');

  personasFiltradas = computed(() => {
  const filtro = this.filtro(), attr = this.atributo(), ord = this.orden();
  return this.personas()
      .filter((p) => (filtro ? (p as any)[attr] === filtro : true))
      .sort((a,b)=> ord==='asc'
        ? String((a as any)[attr]).localeCompare(String((b as any)[attr]), undefined, { numeric:true })
        : String((b as any)[attr]).localeCompare(String((a as any)[attr]), undefined, { numeric:true })
      );
  });

  deletePersona(id:number){
    if(confirm("¿Desea eliminar esta persona?")){
      console.log(id);
      this.personaService.delete(id).subscribe(()=>
      {console.log(`Persona con el id: ${id} Eliminada.`)}
      )
    }
  }

  updatePersona(persona:any){
    this.personaService.selectPersonaToEdit(persona);
    this.router.navigate(['menu/personas/form']);
  }
}
