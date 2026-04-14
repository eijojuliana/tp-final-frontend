import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProveedorService } from '../../../services/proveedor-service';
import { Router } from '@angular/router';
import { Proveedor } from '../../../models/proveedor.model';
import { ToastService } from '../../../services/toast.service';

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
  private toast = inject(ToastService);

  isEditMode=signal(false);
  private proveedorToEdit:Proveedor|null=null;

  form = this.fb.nonNullable.group({
    cuit: [0, [Validators.required, Validators.pattern(/^\d{11}$/)]],
    razonSocial: ['', [Validators.required]],
    nombreFantasia: ['', [Validators.required]],
    condicion: ['', [Validators.required]],
    telefono: [0, [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    direccion: this.fb.nonNullable.group({
      calle: ['', [Validators.required]],
      altura: ['', [Validators.required]],
      piso: [''],
      codigoPostal: ['', [Validators.required]],
      localidad: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      pais: ['', [Validators.required]]
    })
  });


  constructor() {
    effect(() => {
      this.proveedorToEdit = this.proveedorService.proveedorToEdit();

      if (this.proveedorToEdit) {
        this.isEditMode.set(true);
        this.form.patchValue(this.proveedorToEdit);
      } else {
        this.isEditMode.set(false);
        this.form.reset();
      }
    });
  }

  saveProveedor(){
    if(this.form.invalid){return;}

    const formValue = this.form.getRawValue();

    if(this.isEditMode() && this.proveedorToEdit){
      const updateProveedor: Proveedor = { ...this.proveedorToEdit, ...formValue };
      this.proveedorService.update(updateProveedor).subscribe({
        next: () => {
          this.toast.success("Proveedor actualizado correctamente");
          console.log("Proveedor actualizado");
          this.proveedorService.clearProveedorToEdit();
          this.router.navigate(['menu/proveedores']);
        }
      });
    } else {
      this.proveedorService.post(formValue).subscribe({
        next: () => {
          this.toast.success("Proveedor registrado correctamente");
          this.form.reset();
          this.router.navigate(['menu/proveedores']);
        }
      });
    }
  }

  cancelEdit(){
    this.proveedorService.clearProveedorToEdit();
    this.router.navigate(['menu/proveedores']);
  }

  isDireccionVisible = signal(false);

  toggleDireccion() {
    this.isDireccionVisible.update(v => !v);
  }
}
