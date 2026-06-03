import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { PersonaService } from '../../../services/persona-service';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Persona } from '../../../models/persona.model';

@Component({
  selector: 'app-persona-list',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './persona-list.html',
  styleUrl: './persona-list.css',
})
export class PersonaList implements OnInit {

  ngOnInit() {
    this.personaService.load();
  }

  personaService = inject(PersonaService);
  personas = this.personaService.personas;
  router = inject(Router);

  filtro = signal('');
  atributo = signal<string>('');
  orden = signal<'asc' | 'desc' | ''>('');

  personasFiltradas = computed(() => {
    const filtro = this.filtro().toLowerCase();
    const attr = this.atributo();
    const ord = this.orden();

    return this.personas()
      .filter((p) => {
        if (!attr || !filtro) return true;
        return String((p as any)[attr]).toLowerCase().includes(filtro);
      })
      .sort((a, b) => {
        if (!ord || !attr) return 0;
        const valA = String((a as any)[attr]);
        const valB = String((b as any)[attr]);

        return ord === 'asc'
          ? valA.localeCompare(valB, undefined, { numeric: true })
          : valB.localeCompare(valA, undefined, { numeric: true });
      });
  });

  deletePersona(id: number) {
    if (confirm("¿Desea eliminar esta persona?")) {
      this.personaService.delete(id).subscribe();
    }
  }

  updatePersona(persona: Persona) {
    this.personaService.selectPersonaToEdit(persona);
    this.router.navigate(['/menu/personas/form']);
  }

  exportarExcel() {
    this.personaService.exportarExcel();
  }
}
