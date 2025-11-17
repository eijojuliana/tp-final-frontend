import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProveedorService } from '../../../services/proveedor-service';
import { Router } from '@angular/router';
import { NewProveedor, Proveedor } from '../../../models/proveedor.model';

@Component({
  selector: 'app-proveedores-form',
  imports: [ReactiveFormsModule],
  templateUrl: './proveedores-form.html',
  styleUrl: './proveedores-form.css',
})
export class ProveedoresForm {
private fb=inject(FormBuilder);
  proveedorService=inject(ProveedorService);
  private router=inject(Router);

  isEditMode=signal(false);
  private proveedorToEdit:Proveedor|null=null;

  form = this.fb.nonNullable.group({
      nombre:['',[Validators.required,Validators.maxLength(20),Validators.pattern(/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]+$/)]],
      dni:[0,[Validators.required,Validators.pattern(/^\d{6,9}$/)]],
      edad:[0,[Validators.required,Validators.min(18),Validators.max(120)]]
  })


  constructor(){
  effect(()=>{

    this.proveedorToEdit=this.proveedorService.proveedorToEdit();

    if(this.proveedorToEdit){
      this.isEditMode.set(true);

      this.form.patchValue({
        nombre:this.proveedorToEdit.nombre,
        dni:this.proveedorToEdit.dni,
        edad:this.proveedorToEdit.edad
      });
    }else{
      this.isEditMode.set(false);
      this.form.reset();
    }
  })
}


saveProveedor(){

if(this.form.invalid){return;}

const formValue: NewProveedor=this.form.getRawValue();

if(this.isEditMode()&&this.proveedorToEdit){
  const updateProveedor:Proveedor={...this.proveedorToEdit, ...formValue};

  this.proveedorService.update(updateProveedor).subscribe(()=>{
    console.log("Proveedor actualizado");
    this.proveedorService.clearProveedorToEdit();
  })
}else{
 this.proveedorService.post(formValue).subscribe(()=>{
  this.form.reset();
 })
}

this.router.navigate(['menu/proveedores']);
}


cancelEdit(){
  this.proveedorService.clearProveedorToEdit();
  this.router.navigate(['menu/proveedores']);
}

}
