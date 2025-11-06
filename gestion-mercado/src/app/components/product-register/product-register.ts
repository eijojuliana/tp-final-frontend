import { Producto, nuevoProducto } from './../../models/producto.model';
import { ProductService } from './../../services/product-service';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-register',
  imports: [ReactiveFormsModule],
  templateUrl: './product-register.html',
  styleUrl: './product-register.css',
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
      const product = this.productService.productToEdit();

      if (product) {
        this.productToEdit = product;
        this.isEditMode.set(true);
        this.form.patchValue({
          nombre: product.nombre,
          categoria: product.categoria
        });
      } else {
        this.isEditMode.set(false);
        this.productToEdit = null;
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
      });
    } else {
      this.productService.post(formValue).subscribe(() => {
        console.log("Producto Registrado");
        this.form.reset();
      })
    }
    this.router.navigate(['/products'])
  }

  cancelEdit() {
    this.productService.clearProductToEdit();
    this.router.navigate(['/products']);
  }
}
