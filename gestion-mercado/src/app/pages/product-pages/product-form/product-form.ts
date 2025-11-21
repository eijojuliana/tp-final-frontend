import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product-service';
import { nuevoProducto, Producto } from '../../../models/producto.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css'],
})
export class ProductRegister {
  private fb = inject(FormBuilder);
  productService = inject(ProductService);
  private router = inject(Router);
  toast = inject(ToastService);

  isEditMode = signal(false);
  private productToEdit: Producto | null = null;

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
    url: ['', [Validators.required]]
  });

  constructor() {
    effect(() => {
      this.productToEdit = this.productService.productToEdit();

      if (this.productToEdit) {
        this.isEditMode.set(true);
        this.form.patchValue({
          nombre: this.productToEdit.nombre,
          categoria: this.productToEdit.categoria,
          url: this.productToEdit.url,
        });
      } else {
        this.isEditMode.set(false);
        this.form.reset();
      }
    });
  }

  saveProduct() {
    if (this.form.invalid) return;

    const formValue: nuevoProducto = this.form.getRawValue();

    if (this.isEditMode() && this.productToEdit) {
      const updatedProduct = { ...this.productToEdit, ...formValue };

      this.productService.update(updatedProduct).subscribe({
        next: () => {
          this.toast.success("Producto actualizado correctamente");
          this.productService.clearProductToEdit();
          this.router.navigate(['/menu/productos']);
        }
      });
    } else {
      this.productService.post(formValue).subscribe({
        next: () => {
          this.toast.success("Producto registrado correctamente");
          this.form.reset();
          this.router.navigate(['/menu/productos']);
        }
      });
    }
  }

  cancelEdit() {
    this.productService.clearProductToEdit();
    this.router.navigate(['/menu/productos']);
  }
}
