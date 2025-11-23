import { Usuario } from './../../../models/usuario.model';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario-service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-usuario-form',
  imports: [ReactiveFormsModule],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioForm {
  private fb = inject(FormBuilder)
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private toast = inject(ToastService);

  passwordVisible: boolean = false;
  public editMode = signal(false);
  private usuarioToEdit: Usuario | null = null;

  form = this.fb.nonNullable.group({
    email: ['',Validators.required],
    contraseña: [''],
  });

  constructor() {
    effect(() => {
      this.usuarioToEdit = this.usuarioService.usuarioToEdit();

      if (this.usuarioToEdit) {
        this.editMode.set(true);
        this.form.patchValue({
          email:this.usuarioToEdit.email
        });
      } else {
        this.editMode.set(false);
        this.form.reset();
      }
    });
  }


  save(){
    if(this.form.invalid) return;

    const formValue = this.form.getRawValue();

    const dto = {
      email: formValue.email,
      contraseña: formValue.contraseña,
      rol: "ROLE_ADMIN",
    };

    if(this.editMode() && this.usuarioToEdit){
      const updatedUsuario = { ...this.usuarioToEdit, ...dto };
      this.usuarioService.update(updatedUsuario).subscribe({
        next: () => {
          this.toast.success("Usuario actualizado correctamente");
          console.log('Usuario Actualizado');
          this.usuarioService.clearUsuarioToEdit();
          this.router.navigate(['/menu/usuarios']);
        }
      });
    } else {
      this.usuarioService.post(dto).subscribe({
        next: () => {
          this.toast.success("Usuario registrado correctamente");
          console.log("Usuario Agregado.");
          this.form.reset();
          this.router.navigate(['/menu/usuarios']);
        }
      });
    }
  }


 cancelEdit() {
    this.usuarioService.clearUsuarioToEdit();
    this.router.navigate(['/menu/usuarios']);
  }

  togglePasswordVisibility(): void {
  this.passwordVisible = !this.passwordVisible;
}
}


