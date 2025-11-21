import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpleadoService } from '../../../services/empleado-service';
import { Router } from '@angular/router';
import { Empleado, NewEmpleado } from '../../../models/empleado.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-empleado-form',
  imports: [ReactiveFormsModule],
  templateUrl: './empleado-form.html',
  styleUrl: './empleado-form.css',
})
export class EmpleadoForm {

  private fb=inject(FormBuilder);
  empleadoService=inject(EmpleadoService);
  private router=inject(Router);
  private toast = inject(ToastService);

  isEditMode=signal(false);
  private empleadoToEdit:Empleado|null=null;

  form=this.fb.nonNullable.group({
    nombre:['',[Validators.required,Validators.maxLength(20),Validators.pattern(/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]+$/)]],
    dni:[0,[Validators.required,Validators.pattern(/^\d{6,9}$/)]],
    edad:[0,[Validators.required,Validators.min(18),Validators.max(120)]],
    email:['',[Validators.required,Validators.email]],
    contraseña: ['']
  })


  constructor(){

    effect(()=>{

      this.empleadoToEdit=this.empleadoService.empleadoToEdit();

      if(this.empleadoToEdit){
        this.isEditMode.set(true);

        this.form.patchValue({
          nombre:this.empleadoToEdit.nombre,
          dni:this.empleadoToEdit.dni,
          edad:this.empleadoToEdit.edad,
          email:this.empleadoToEdit.email
        })
      }else{
        this.isEditMode.set(false);
        this.form.reset();
      }
    })
  }


  saveEmpleado() {
  if(this.form.invalid){return;}

  const formValue: NewEmpleado = this.form.getRawValue();

  if(this.isEditMode() && this.empleadoToEdit){
    const updateEmpleado: Empleado = { ...this.empleadoToEdit, ...formValue };

    this.empleadoService.update(updateEmpleado).subscribe({
      next: () => {
        this.toast.success("Empleado actualizado correctamente");
        console.log("Empleado actualizado");
        this.empleadoService.clearEmpleadoToEdit();
        this.router.navigate(['/menu/empleados']);
      }
    });
  } else {
    this.empleadoService.agregar(formValue).subscribe({
      next: () => {
        this.toast.success("Empleado registrado correctamente");
        this.form.reset();
        this.router.navigate(['/menu/empleados']);
      }
    });
  }
}

  cancelEdit(){
    this.empleadoService.clearEmpleadoToEdit();
    this.router.navigate(['/menu/empleados']);

  }

















  //fin
}
