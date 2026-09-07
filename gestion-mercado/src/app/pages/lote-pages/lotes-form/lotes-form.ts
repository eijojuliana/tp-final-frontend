import { Component } from '@angular/core';
import {inject, signal, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoteService } from '../../../services/lote-service';
import { Lote, newLote } from '../../../models/lote.model';
import { Producto } from '../../../models/producto.model';
import { ProductService } from '../../../services/product-service';
import { ToastService } from '../../../services/toast.service';
import { Validaciones } from '../../../validations/Validaciones';
import { TiendaService } from '../../../services/tienda-service';

@Component({
  selector: 'app-lotes-form',
  imports: [ReactiveFormsModule],
  templateUrl: './lotes-form.html',
  styleUrl: './lotes-form.css',
})
export class LotesForm {

  private fb = inject(FormBuilder);
  loteService = inject(LoteService);
  productService = inject(ProductService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private validacion = inject(Validaciones);
  private tiendaService = inject(TiendaService);

  isEditMode = signal(false);
  private loteToEdit: Lote | null = null;

  productos = this.productService.productos;

  compararProductos(a: Producto | null, b: Producto | null): boolean {
    return !!a && !!b && a.producto_id === b.producto_id;
  }

  form = this.fb.nonNullable.group({
    producto: [undefined as unknown as Producto, Validators.required],
    cantidadDisponible: [0, Validators.required],
    costoUnitario: [0, [Validators.required, Validators.min(1)]],
    fechaIngreso: ['', [Validators.required, this.validacion.fechaValida, this.validacion.fechaNoAnteriorA(() => this.tiendaService.tienda()?.fechaInicioActividades)]],
  });

  constructor() {
    effect(() => {
      this.loteToEdit = this.loteService.loteToEdit();

      if (this.loteToEdit) {
        this.isEditMode.set(true);

        this.form.patchValue({
          producto: this.loteToEdit.producto,
          cantidadDisponible: this.loteToEdit.cantidadDisponible,
          costoUnitario: this.loteToEdit.costoUnitario,
          fechaIngreso: this.loteToEdit.fechaIngreso,
        });
      } else {
        this.isEditMode.set(false);
        this.form.reset();
      }
    });
  }

  saveLote() {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();

    const [anio, mes, dia] = formValue.fechaIngreso.split('-');
    const fechaFormateada = `${dia}/${mes}/${anio}`;

    const dto = {
      producto: formValue.producto,
      cantidadDisponible: formValue.cantidadDisponible,
      costoUnitario: formValue.costoUnitario,
      fechaIngreso: fechaFormateada
    };

    if (this.isEditMode() && this.loteToEdit) {
      this.loteService.update({ ...this.loteToEdit, ...dto }).subscribe({
        next: () => {
          this.toast.success("Lote actualizado correctamente");
          this.loteService.clearLoteToEdit();
          this.router.navigate(['/menu/lotes']);
        }
      });
    } else {
      this.loteService.post(dto).subscribe({
        next: () => {
          this.toast.success("Lote registrado correctamente");
          this.form.reset();
          this.router.navigate(['/menu/lotes']);
        }
      });
    }
  }
  cancelEdit() {
    this.loteService.clearLoteToEdit();
    this.router.navigate(['/menu/lotes']);
  }
}
