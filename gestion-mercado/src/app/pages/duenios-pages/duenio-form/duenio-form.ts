import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DuenioService } from '../../../services/duenio-service';
import { Duenio, NewDuenio } from '../../../models/duenio.model';

@Component({
  selector: 'app-duenio-form',
  imports: [ReactiveFormsModule],
  templateUrl: './duenio-form.html',
  styleUrl: './duenio-form.css',
})
export class DuenioForm {

  private fb = inject(FormBuilder);
  private service = inject(DuenioService);
  private router = inject(Router);

  isEditMode = signal(false);
  private duenioToEdit: Duenio | null = null;

  private rutaListado: string = '/menu/duenios';

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    dni: [0, [Validators.required, Validators.min(1)]],
    edad: [0, [Validators.required, Validators.min(18)]],
    email: ['', [Validators.required, Validators.email]],
    contraseña: [''],
  });

  constructor() {
    effect(() => {
      this.duenioToEdit = this.service.duenioToEdit();

      if (this.duenioToEdit) {
        this.isEditMode.set(true);
        this.form.patchValue({
          nombre: this.duenioToEdit.nombre,
          dni: this.duenioToEdit.dni,
          edad: this.duenioToEdit.edad,
          email:this.duenioToEdit.email
        });
      } else {
        this.isEditMode.set(false);
        this.form.reset();
      }
    });
  }

  save() {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();
    const dto = {
      nombre: formValue.nombre,
      dni: formValue.dni,
      edad: formValue.edad,

        email: formValue.email,
        contraseña: formValue.contraseña,

    };
    alert(formValue.contraseña)
    console.log(dto);

    if (this.isEditMode() && this.duenioToEdit) {

      const updatedDuenio = { ...this.duenioToEdit, ...dto };
      this.service.update(updatedDuenio).subscribe(() => {
        console.log('Duenio Actualizado');
        this.service.clearDuenioToEdit();
      });

    } else {

      this.service.post(dto).subscribe(() => {
        console.log('Duenio Registrado');
        this.form.reset();
      });
    }
    this.router.navigate([this.rutaListado]);
  }

  cancelEdit() {
    this.service.clearDuenioToEdit();
    this.router.navigate([this.rutaListado]);
  }
}
