import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product-service';
import { InventarioService } from '../../../services/inventario-service';
import { nuevoProducto, Producto } from '../../../models/producto.model';
import { Inventario } from '../../../models/inventario.model';
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
  private productService = inject(ProductService);
  private inventarioService = inject(InventarioService);
  private router = inject(Router);
  private toast = inject(ToastService);

  isEditMode = signal(false);
  private productToEdit: Producto | null = null;
  private inventarioToEdit: Inventario | null = null;

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
    url: ['', [Validators.required]],
    stockMin: [0, [Validators.required, Validators.min(0)]],
    precioVenta: [0, [Validators.required, Validators.min(0.01)]]
  });

  constructor() {
    effect(() => {
      const invEdit = this.inventarioService.inventarioToEdit();
      const prodEdit = this.productService.productToEdit();

      this.inventarioToEdit = invEdit;
      this.productToEdit = prodEdit;

      if (invEdit) {
        this.isEditMode.set(true);
        const prod = this.productService.productos().find(p => p.producto_id === invEdit.producto_id);
        this.form.patchValue({
          nombre: prod?.nombre || '',
          categoria: prod?.categoria || '',
          url: prod?.url || '',
          stockMin: invEdit.stockMin,
          precioVenta: invEdit.precioVenta
        });
      } else if (prodEdit) {
        this.isEditMode.set(true);
        const inv = this.inventarioService.inventarios().find(i => i.producto_id === prodEdit.producto_id);
        this.form.patchValue({
          nombre: prodEdit.nombre,
          categoria: prodEdit.categoria,
          url: prodEdit.url,
          stockMin: inv?.stockMin || 0,
          precioVenta: inv?.precioVenta || 0
        });
      } else {
        this.isEditMode.set(false);
        this.form.reset({ nombre: '', categoria: '', url: '', stockMin: 0, precioVenta: 0 });
      }
    });
  }

  saveProduct() {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();

    if (this.isEditMode()) {
      if (this.productToEdit) {
        const updatedProduct: Producto = {
          producto_id: this.productToEdit.producto_id,
          nombre: formValue.nombre,
          categoria: formValue.categoria,
          url: formValue.url
        };

        this.productService.update(updatedProduct).subscribe({
          next: () => {
            const existingInv = this.inventarioService.inventarios().find(
              i => i.producto_id === this.productToEdit!.producto_id
            );

            if (existingInv) {
              const updatedInv: Inventario = {
                ...existingInv,
                stockMin: Number(formValue.stockMin),
                precioVenta: Number(formValue.precioVenta)
              };
              this.inventarioService.update(updatedInv).subscribe({
                next: () => {
                  this.toast.success("Producto e inventario actualizados correctamente");
                  this.clearEditStates();
                  this.router.navigate(['/menu/productos']);
                }
              });
            } else {
              this.toast.success("Producto actualizado correctamente");
              this.clearEditStates();
              this.router.navigate(['/menu/productos']);
            }
          }
        });
      } else if (this.inventarioToEdit) {
        const prodToUpdate = this.productService.productos().find(
          p => p.producto_id === this.inventarioToEdit!.producto_id
        );

        if (prodToUpdate) {
          const updatedProduct: Producto = {
            ...prodToUpdate,
            nombre: formValue.nombre,
            categoria: formValue.categoria,
            url: formValue.url
          };
          this.productService.update(updatedProduct).subscribe({
            next: () => {
              const updatedInv: Inventario = {
                ...this.inventarioToEdit!,
                stockMin: Number(formValue.stockMin),
                precioVenta: Number(formValue.precioVenta)
              };
              this.inventarioService.update(updatedInv).subscribe({
                next: () => {
                  this.toast.success("Producto e inventario actualizados correctamente");
                  this.clearEditStates();
                  this.router.navigate(['/menu/productos']);
                }
              });
            }
          });
        }
      }
    } else {
      const newProduct: nuevoProducto = {
        nombre: formValue.nombre,
        categoria: formValue.categoria,
        url: formValue.url,
        stockMin: Number(formValue.stockMin),
        precioVenta: Number(formValue.precioVenta)
      };

      this.productService.post(newProduct).subscribe({
        next: () => {
          this.toast.success("Producto e inventario registrados correctamente");
          this.form.reset();
          this.router.navigate(['/menu/productos']);
        }
      });
    }
  }

  private clearEditStates() {
    this.productService.clearProductToEdit();
    this.inventarioService.clearInventarioToEdit();
  }

  cancelEdit() {
    this.clearEditStates();
    this.router.navigate(['/menu/productos']);
  }
}
