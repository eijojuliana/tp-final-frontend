import { Component, inject } from '@angular/core';
import { DuenioService } from '../../../services/duenio-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-duenio-list',
  imports: [RouterLink],
  templateUrl: './duenios-list.html',
  styleUrl: './duenios-list.css',
})
export class DueniosList {

  service = inject(DuenioService);
  duenios = this.service.duenios;

}
