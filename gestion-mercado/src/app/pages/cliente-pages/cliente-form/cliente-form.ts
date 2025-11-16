import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ClienteService } from '../../../services/cliente-service';
import { Router } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';

@Component({
  selector: 'app-cliente-form',
  imports: [],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
})
export class ClienteForm {

  private fb=inject(FormBuilder);
  clienteService=inject(ClienteService);
  private router=inject(Router);

  isEditMode=sginal(false);
  private clienteToEdit:Cliente|null=null;

  form=this.fb.nonNullable.group({
      nombre:
      dni:
      edad:



  })














}
function sginal(arg0: boolean) {
  throw new Error('Function not implemented.');
}

