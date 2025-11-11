import { Component,effect,inject,signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonaService } from '../../../services/persona-service';
import { Router } from '@angular/router';
import { newPersona, Persona } from '../../../models/persona.model';

@Component({
  selector: 'app-persona-form',
  imports: [ReactiveFormsModule],
  templateUrl: './persona-form.html',
  styleUrl: './persona-form.css',
})
export class PersonaForm {
  private fb=inject(FormBuilder);
  PersonasService=inject(PersonaService);
  private router= inject(Router);

  isEditMode =signal(false);
  private personaToEdit : Persona | null = null;

  form=this.fb.nonNullable.group({
    nombre:['',[Validators.required]],
    dni:[0,[Validators.required]],
    edad:[0,[Validators.required]]
  });

  constructor() {
    effect(()=>{
      this.personaToEdit =this.PersonasService.personaToEdit();

      if(this.personaToEdit){
        this.isEditMode.set(true);
        this.form.patchValue({
          nombre:this.personaToEdit.nombre,
          dni:this.personaToEdit.dni,
          edad:this.personaToEdit.edad
        });
      }else{
        this.isEditMode.set(false);
        this.form.reset();
      }
    });
  }

  savePersona(){
     if(this.form.invalid) return;

     const formValue : newPersona = this.form.getRawValue();

     if(this.isEditMode() && this.personaToEdit){
       const updatePersona= {...this.personaToEdit,...formValue};
       this.PersonasService.update(updatePersona).subscribe(()=> {
          console.log("Persona Actualizada");
          this.PersonasService.clearPersonaToEdit();
          this.router.navigate(['/personas'])
       });
     }else{
      this.PersonasService.post(formValue).subscribe(()=>{
         console.log("Persona Registrada");
         this.form.reset();
         this.router.navigate(['/personas'])
      })
     }
}

cancelEdit(){
  this.PersonasService.clearPersonaToEdit();
  this.router.navigate(['/personas']);
}
}

