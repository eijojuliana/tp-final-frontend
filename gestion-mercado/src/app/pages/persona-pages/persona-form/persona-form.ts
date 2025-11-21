import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonaService } from '../../../services/persona-service';
import { Router } from '@angular/router';
import { Persona } from '../../../models/persona.model';

@Component({
  selector: 'app-persona-form',
  imports: [ReactiveFormsModule],
  templateUrl: './persona-form.html',
  styleUrl: './persona-form.css',
})
export class PersonaForm {
  private fb = inject(FormBuilder);
  PersonasService = inject(PersonaService);
  private router = inject(Router);

  isEditMode = signal(false);
  private personaToEdit: Persona | null = null;

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]+$/)]],
    dni: [0, [Validators.required, Validators.pattern(/^\d{6,9}$/)]],
    edad: [0, [Validators.required, Validators.min(18), Validators.max(120)]],
  });

  constructor() {
    effect(() => {
      this.personaToEdit = this.PersonasService.personaToEdit();

      if (this.personaToEdit) {
        this.isEditMode.set(true);
        this.form.patchValue({
          nombre: this.personaToEdit.nombre,
          dni: this.personaToEdit.dni,
          edad: this.personaToEdit.edad,
        });
      } else {
        this.isEditMode.set(false);
        this.form.reset();
      }
    });
  }

  savePersona() {
    if (this.form.invalid || !this.isEditMode() || !this.personaToEdit) return;

    const formValue = this.form.getRawValue();
    const updatePersona = { ...this.personaToEdit, ...formValue };

    this.PersonasService.update(updatePersona).subscribe(() => {
      console.log('Persona Actualizada');
      this.PersonasService.clearPersonaToEdit();
      this.router.navigate(['/menu/personas']);
    });
  }

  cancelEdit() {
    this.PersonasService.clearPersonaToEdit();
    this.router.navigate(['/menu/personas']);
  }
}
