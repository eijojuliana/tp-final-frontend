import { Component, inject } from '@angular/core';
import { DuenioService } from '../../../services/duenio-service';

@Component({
  selector: 'app-duenio-list',
  imports: [],
  templateUrl: './duenios-list.html',
  styleUrl: './duenios-list.css',
})
export class DueniosList {

  service = inject(DuenioService);
  duenios = this.service.duenios;

}
