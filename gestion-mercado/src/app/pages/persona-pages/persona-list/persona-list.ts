import { Component, computed, inject, signal } from '@angular/core';
import { PersonaService } from '../../../services/persona-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-persona-list',
  imports: [RouterLink],
  templateUrl: './persona-list.html',
  styleUrl: './persona-list.css',
})
export class PersonaList {

  personaService = inject(PersonaService);
  personas = this.personaService.personas;
  router=inject(Router);


  filtro = signal('');
  atributo = signal<'nombre' | 'dni'|'edad'>('nombre');

  personasFiltradas = computed(() => {
    const f = this.filtro().toLowerCase().trim();
    const attr = this.atributo();

    return this.personas().filter(p =>
      String((p as any)[attr]).toLowerCase().includes(f)
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
