import { Component, inject } from '@angular/core';
import { ClienteService } from '../../../services/cliente-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cliente-list',
  imports: [RouterLink],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css',
})
export class ClienteList {
service=inject(ClienteService);
clientes=this.service.clientes;
}
