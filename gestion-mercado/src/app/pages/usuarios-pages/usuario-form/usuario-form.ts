import { Usuario } from './../../../models/usuario.model';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario-service';
import { Router } from '@angular/router';

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

  public editMode = signal(false);
  private usuarioToEdit: Usuario | null = null;

  form = this.fb.nonNullable.group({
    email: ['',Validators.required],
    contraseña: ['',Validators.required],
  });

  save(){
    if(this.form.invalid) return;

    const formValue = this.form.getRawValue();

    const dto = {
      email: formValue.email,
      contraseña: formValue.contraseña,
      rol: "ROLE_ADMIN",
    };

    if(this.editMode() && this.usuarioToEdit){
      //editar
    } else {
       this.usuarioService.post(dto).subscribe( () => {
        console.log("Usuario Agregado.");
        this.form.reset();
       });
    }
    this.router.navigate(['/menu/usuarios']);
  }
}
