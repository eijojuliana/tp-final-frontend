import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TiendaService } from './../../../services/tienda-service';
import { Component, effect, inject, signal } from '@angular/core';
import { Tienda } from '../../../models/tienda.model';

@Component({
  selector: 'app-tiendas-form',
  imports: [ReactiveFormsModule],
  templateUrl: './tiendas-form.html',
  styleUrl: './tiendas-form.css',
})
export class TiendasForm {
  private tiendaService = inject(TiendaService);
  private fb = inject(FormBuilder);

  tiendaToEdit: Tienda | null = null;

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    caja: [0, [Validators.required]],
    duenio: [0, [Validators.required]]
  });

  constructor() {
    effect(() => {
      this.tiendaToEdit = this.tiendaService.tiendaToEdit();

      if (this.tiendaToEdit) {
        this.form.patchValue({
          nombre: this.tiendaToEdit.nombre,
          direccion: this.tiendaToEdit.direccion,
          caja: this.tiendaToEdit.caja,
          duenio: this.tiendaToEdit.duenio
        });
      }
    });
  }

  saveTienda() {
    if (this.form.invalid || !this.tiendaToEdit) return;

    const updatedTienda: Tienda = {...this.tiendaToEdit,...this.form.getRawValue()};

    this.tiendaService.update(updatedTienda).subscribe(() => {
      console.log('Tienda Actualizada');
      this.tiendaService.limpiarTiendaToEdit();
    });
  }

  cancelarUpdate() {
    this.tiendaService.limpiarTiendaToEdit();
  }
}
