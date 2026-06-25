import { Validaciones } from '../../../validations/Validaciones';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../../services/cliente-service';
import { Router } from '@angular/router';
import { Cliente, NewCliente } from '../../../models/cliente.model';
import { ToastService } from '../../../services/toast.service';
import { PedidoPersistenceService } from '../../../services/pedido-persistence-service';

@Component({
  selector: 'app-cliente-form',
  imports: [ReactiveFormsModule],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
})
export class ClienteForm {

  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private validacion = inject(Validaciones);
  private persistenceService = inject(PedidoPersistenceService);

  isEditMode=signal(false);
  private clienteToEdit:Cliente|null=null;

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]+$/)]],
    apellido: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]+$/)]],
    dni: [0, [Validators.required, Validators.pattern(/^\d{6,9}$/)]],
    fechaNacimiento: ['',[Validators.required, this.validacion.fechaValida]],
  });

  constructor() {
    effect(() => {
      this.clienteToEdit = this.clienteService.clienteToEdit();

      if (this.clienteToEdit) {
        this.isEditMode.set(true);
        this.form.patchValue({
          nombre: this.clienteToEdit.nombre,
          apellido: this.clienteToEdit.apellido,
          dni: this.clienteToEdit.dni,
          fechaNacimiento: this.clienteToEdit.fechaNacimiento as any
        });
      } else {
        this.isEditMode.set(false);
        this.form.reset();
      }
    });
  }

  saveCliente() {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();

    if (this.isEditMode() && this.clienteToEdit) {
      this.clienteService.update({...this.clienteToEdit,...formValue}).subscribe({
        next: () => {
          this.toast.success("Dueño actualizado correctamente");
          console.log('Cliente Actualizado');
          this.clienteService.clearClienteToEdit();
          this.router.navigate(['/menu/clientes']);
        }
      });
    } else {
      this.clienteService.post(formValue).subscribe({
        next: () => {
          this.toast.success("Cliente registrado correctamente");
          console.log('Cliente Registrado');
          this.form.reset();
          const estadoPedido = this.persistenceService.getState();

      if (estadoPedido) {
          this.router.navigate(['/menu/pedidos/form']);
        } else {
          this.router.navigate(['/menu/clientes']);
        }

        }
      });
    }
  }

  cancelEdit() {
    this.clienteService.clearClienteToEdit();
    this.router.navigate(['/menu/clientes']);
  }
}
