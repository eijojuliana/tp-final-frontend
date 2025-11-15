import { EmpleadoService } from './../../../services/empleado-service';
import { Component, inject } from '@angular/core';


@Component({
  selector: 'app-empleado-list',
  imports: [],
  templateUrl: './empleado-list.html',
  styleUrl: './empleado-list.css',
})
export class EmpleadoList {
 service=inject(EmpleadoService);
 empleados=this.service.empleados;
}
