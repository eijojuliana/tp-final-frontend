import { Component, inject, OnInit, effect, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TiendaService } from '../../../services/tienda-service';
import { ToastService } from '../../../services/toast.service';
import { newTienda} from '../../../models/tienda.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tienda-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tienda-page.html',
  styleUrl: './tienda-page.css',
})
export class TiendaPage implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private tiendaService = inject(TiendaService);
  private toast = inject(ToastService);
  public isEditMode = signal(false);

  public form = this.fb.group({
    tiendaId: [1],
    razonSocial: ['', Validators.required],
    nombreFantasia: [''],
    cuit: [0, Validators.required],
    duenioDni: [0, Validators.required],
    condicion: ['Monotributo'],
    url: ['', [Validators.required]],
    ingresosBrutos: [''],
    fechaInicioActividades: ['', Validators.required],
    puntoDeVenta: [1, Validators.required],
    caja: [0, Validators.required],
    direccion: this.fb.group({
      calle: [''],
      altura: [''],
      piso: [''],
      codigopostal: ['7600'],
      localidad: ['Mar del Plata'],
      provincia: ['Buenos Aires'],
      pais: ['Argentina']
    })
  });

  constructor() {
    effect(() => {
      const datos = this.tiendaService.tienda();
      // Verificamos que los datos existan y tengan contenido real
      if (datos && datos.tiendaId > 0) {
        console.log("Cargando datos en el formulario...", datos);
        this.form.patchValue(datos);
        this.isEditMode.set(true);
      } else {
        this.isEditMode.set(false);
      }
    });
  }

  ngOnInit() {
    this.tiendaService.load();
  }

  saveTienda() {
    if (this.form.invalid) {
      this.toast.error("Por favor, complete los campos obligatorios");
      return;
    }

    const formValue = this.form.getRawValue() as newTienda;
    formValue.condicion = 'Monotributo';

    if (this.isEditMode()) {
      // eto es para el campo de monto de caja, que se mantenga siempre igual (porque está oculto solamente, es para evitar errores)
      const tiendaActual = this.tiendaService.tienda();
      if (tiendaActual) {
        formValue.caja = tiendaActual.caja;
      }

      // Usamos el ID del formulario para la actualización
      this.tiendaService.update(formValue).subscribe({
        next: (exito) => {
          if (exito) {
            this.toast.success("Configuración actualizada correctamente");
          }
        }
      });
    } else {
      this.tiendaService.post(formValue as newTienda).subscribe({
        next: () => {
          this.toast.success("Tienda registrada correctamente");
          this.router.navigateByUrl('/menu');
        }
      });
    }
  }

  cancelarEdicion() {
    const datosOriginales = this.tiendaService.tienda();
    if (datosOriginales) {
      this.form.patchValue(datosOriginales);
    }
  }
}
