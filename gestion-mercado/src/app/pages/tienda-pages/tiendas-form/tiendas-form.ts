import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TiendaService } from './../../../services/tienda-service';
import { Component, effect, inject, signal } from '@angular/core';
import { NewTienda, Tienda } from '../../../models/tienda.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tiendas-form',
  imports: [ReactiveFormsModule],
  templateUrl: './tiendas-form.html',
  styleUrl: './tiendas-form.css',
})
export class TiendasForm {
  private tiendaService = inject(TiendaService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isEditMode = signal(false);
  tiendaToEdit: Tienda | null = null;

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    caja: [0, [Validators.required]],
    duenioDni: []
  });

  constructor() {
    effect(() => {
      this.tiendaToEdit = this.tiendaService.tiendaToEdit();

      if (this.tiendaToEdit) {
        this.isEditMode = signal(true);
        this.form.patchValue({
          nombre: this.tiendaToEdit.nombre,
          direccion: this.tiendaToEdit.direccion,
          caja: this.tiendaToEdit.caja,
        });
      } else {
        this.isEditMode = signal(false);
        this.form .reset();
      }
    });
  }

  saveTienda() {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue() as NewTienda;

    if(this.isEditMode() && this.tiendaToEdit) {
      const tiendaId = this.tiendaToEdit.tiendaId;
      this.tiendaService.update(formValue,tiendaId).subscribe(() => {
        console.log('Tienda Actualizada');
        this.tiendaService.limpiarTiendaToEdit();
      });
    } else {
      this.tiendaService.post(formValue).subscribe(() => {
        console.log("Producto Registrado");
        this.form.reset();
        this.router.navigate(['/menu/productos'])
      })
    }
  }

  cancelarUpdate() {
    this.tiendaService.limpiarTiendaToEdit();
  }
}
