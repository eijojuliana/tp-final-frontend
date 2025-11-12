
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product-service';
import { nuevoProducto, Producto } from '../../../models/producto.model';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductRegister {
  private fb = inject(FormBuilder);
  productService = inject(ProductService);
  private router = inject(Router);

  isEditMode = signal(false);
  private productToEdit: Producto | null = null;

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    categoria: ['', [Validators.required]]
  });

  constructor() {
    effect(() => {
      this.productToEdit = this.productService.productToEdit();

      if (this.productToEdit) {
        this.isEditMode.set(true);
        this.form.patchValue({
          nombre: this.productToEdit.nombre,
          categoria: this.productToEdit.categoria
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

    if(this.isEditMode() && this.productToEdit) {
      const updatedProduct = {...this.productToEdit, ...formValue};
      this.productService.update(updatedProduct).subscribe(() => {
        console.log("Producto Actualizado");
        this.productService.clearProductToEdit();
        this.router.navigate(['/products'])
      });
    } else {
      this.productService.post(formValue).subscribe(() => {
        console.log("Producto Registrado");
        this.form.reset();
        this.router.navigate(['/products'])
      })
    }
  }

  cancelEdit() {
    this.productService.clearProductToEdit();
    this.router.navigate(['/products']);
  }
}
