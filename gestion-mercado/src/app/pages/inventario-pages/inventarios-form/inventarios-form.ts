import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Inventario } from '../../../models/inventario.model';
import { InventarioService } from '../../../services/inventario-service';
import { ProductService } from '../../../services/product-service';
import { ToastService } from '../../../services/toast.service';

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
  private toast = inject(ToastService);
  productos = this.productService.productos;

  isEditMode = signal(false);
  private inventarioToEdit: Inventario | null = null;

  form = this.fb.nonNullable.group({
    producto_id: [0, [Validators.required, Validators.min(1)]],
    cantidad: [0, Validators.required],
    stockMin: [0, Validators.required],
    precioVenta: [0, [Validators.required, Validators.min(0.01)]],
    costoAdquisicion: [0, [Validators.required, Validators.min(0.01)]]
  });

  constructor() {
    effect(() => {
      this.inventarioToEdit = this.inventarioService.inventarioToEdit();

      if (this.inventarioToEdit) {
        this.isEditMode.set(true);

        this.form.patchValue({
          producto_id: this.inventarioToEdit.producto_id,
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
    if (this.form.invalid || !this.isEditMode() || !this.inventarioToEdit) return;

    const formValue = {
      ...this.form.getRawValue(),
      producto_id: Number(this.form.value.producto_id),
      cantidad: Number(this.form.value.cantidad),
      stockMin: Number(this.form.value.stockMin),
      precioVenta: Number(this.form.value.precioVenta),
      costoAdquisicion: Number(this.form.value.costoAdquisicion),
    };

    const updated = { ...this.inventarioToEdit, ...formValue };

    this.inventarioService.update(updated).subscribe({
      next: () => {
        this.toast.success("Inventario actualizado correctamente");
        this.inventarioService.limpiarInventarioToEdit();
        this.router.navigate(['/menu/inventarios']);
      }
    });
  }

  cancelarUpdate() {
    this.inventarioService.limpiarInventarioToEdit();
    this.router.navigate(['/menu/inventarios']);
  }
}
