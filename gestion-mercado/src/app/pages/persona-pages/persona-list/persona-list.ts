import { Component, inject } from '@angular/core';
import { PersonaService } from '../../../services/persona-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-persona-list',
  imports: [RouterLink],
  templateUrl: './persona-list.html',
  styleUrl: './persona-list.css',
})
export class PersonaList {

  personaService = inject(PersonaService);
  personas = this.personaService.personas;

}
