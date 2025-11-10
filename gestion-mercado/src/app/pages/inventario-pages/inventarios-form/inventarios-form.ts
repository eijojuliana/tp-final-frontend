import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Inventario, newInventario } from '../../../models/inventario.model';
import { InventarioService } from '../../../services/inventario-service';
import { ProductService } from '../../../services/product-service';

@Component({
  selector: 'app-inventarios-form',
  imports: [ReactiveFormsModule],
  templateUrl: './inventarios-form.html',
  styleUrl: './inventarios-form.css',
})
export class InventariosForm {
  private fb = inject(FormBuilder);
  private inventarioService = inject(InventarioService);
  private productService = inject(ProductService);
  private router = inject(Router);
  productos = this.productService.productos;

  isEditMode = signal(false);
  private inventarioToEdit: Inventario | null = null;

  form = this.fb.nonNullable.group({
    productoId: [0, Validators.required],
    cantidad: [0, Validators.required],
    stockMin: [0, Validators.required],
    precioVenta: [0, Validators.required],
    costoAdquisicion: [0, Validators.required],
  });

  constructor() {
    effect(() => {
      this.inventarioToEdit = this.inventarioService.inventarioToEdit();

      if (this.inventarioToEdit) {
        this.isEditMode.set(true);

        this.form.patchValue({
          productoId: this.inventarioToEdit.productoId,
          cantidad: this.inventarioToEdit.cantidad,
          stockMin: this.inventarioToEdit.stockMin,
          precioVenta: this.inventarioToEdit.precioVenta,
          costoAdquisicion: this.inventarioToEdit.costoAdquisicion
        });
      } else {
        this.isEditMode.set(false);
        this.form.reset();
      }
    });
  }

  saveInventario() {
    if (this.form.invalid) return;

    const formValue = {...this.form.getRawValue(),
      productoId: Number(this.form.value.productoId),
      cantidad: Number(this.form.value.cantidad),
      stockMin: Number(this.form.value.stockMin),
      precioVenta: Number(this.form.value.precioVenta),
      costoAdquisicion: Number(this.form.value.costoAdquisicion),
    };

    if (this.isEditMode() && this.inventarioToEdit) {

      const updated = {...this.inventarioToEdit,...formValue};

      this.inventarioService.update(updated).subscribe(() => {
        this.inventarioService.limpiarInventarioToEdit();
        this.router.navigate(['/inventarios']);
      });
    } else {
      this.inventarioService.post(formValue).subscribe(() => {
        this.form.reset();
        this.router.navigate(['/inventarios']);
      });
    }
  }

  cancelarUpdate() {
    this.inventarioService.limpiarInventarioToEdit();
    this.router.navigate(['/inventarios']);
  }
}
