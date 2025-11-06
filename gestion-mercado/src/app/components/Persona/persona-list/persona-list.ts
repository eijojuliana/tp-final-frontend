import { Component, inject } from '@angular/core';
import { PersonaService } from '../../persona-service';

@Component({
  selector: 'app-persona-list',
  imports: [],
  templateUrl: './persona-list.html',
  styleUrl: './persona-list.css',
})
export class PersonaList {

  personaService = inject(PersonaService);
  personas = this.personaService.personas;

}
