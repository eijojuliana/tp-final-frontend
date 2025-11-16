import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../../services/cliente-service';
import { Router } from '@angular/router';
import { Cliente, NewCliente } from '../../../models/cliente.model';

@Component({
  selector: 'app-cliente-form',
  imports: [ReactiveFormsModule],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
})
export class ClienteForm {

  private fb=inject(FormBuilder);
  clienteService=inject(ClienteService);
  private router=inject(Router);

  isEditMode=signal(false);
  private clienteToEdit:Cliente|null=null;

  form = this.fb.nonNullable.group({
      nombre:['',[Validators.required,Validators.maxLength(20),Validators.pattern(/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]+$/)]],
      dni:[0,[Validators.required,Validators.pattern(/^\d{6,9}$/)]],
      edad:[0,[Validators.required,Validators.min(18),Validators.max(120)]]
  })


  constructor(){
  effect(()=>{

    this.clienteToEdit=this.clienteService.clienteToEdit();

    if(this.clienteToEdit){
      this.isEditMode.set(true);

      this.form.patchValue({
        nombre:this.clienteToEdit.nombre,
        dni:this.clienteToEdit.dni,
        edad:this.clienteToEdit.edad
      });
    }else{
      this.isEditMode.set(false);
      this.form.reset();
    }
  })
}


saveCliente(){

if(this.form.invalid){return;}

const formValue: NewCliente=this.form.getRawValue();

if(this.isEditMode()&&this.clienteToEdit){
  const updateCliente:Cliente={...this.clienteToEdit, ...formValue};

  this.clienteService.modificar(updateCliente).subscribe(()=>{
    console.log("Persona actualizada");
    this.clienteService.clearClienteToEdit();
  })
}else{
 this.clienteService.agregar(formValue).subscribe(()=>{
  this.form.reset();
 })
}

this.router.navigate(['menu/clientes']);
}


cancelEdit(){
  this.clienteService.clearClienteToEdit();
  this.router.navigate(['menu/clientes']);
}












}
