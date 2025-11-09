import { Component } from '@angular/core';
import {inject, signal, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoteService } from '../../../services/lote-service';
import { Lote, newLote } from '../../../models/lote.model';
import { Producto } from '../../../models/producto.model';
import { ProductService } from '../../../services/product-service';

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

  isEditMode = signal(false);
  private loteToEdit: Lote | null = null;

  productos = this.productService.productos;

  form = this.fb.nonNullable.group({
    producto: [undefined as unknown as Producto, Validators.required],
    cantidadDisponible: [0, Validators.required],
    costoUnitario: [0, Validators.required],
    fechaIngreso: ['', Validators.required],
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

    const formValue: newLote = this.form.getRawValue();

    if (this.isEditMode() && this.loteToEdit) {
      const updatedLote = { ...this.loteToEdit, ...formValue };

      this.loteService.update(updatedLote).subscribe(() => {
        console.log("Lote actualizado");
        this.loteService.limpiarLoteToEdit();
        this.router.navigate(['/lotes']);
      });
    } else {
      this.loteService.post(formValue).subscribe(() => {
        console.log("Lote registrado");
        this.form.reset();
        this.router.navigate(['/lotes']);
      });
    }
  }

  cancelEdit() {
    this.loteService.limpiarLoteToEdit();
    this.router.navigate(['/lotes']);
  }
}
