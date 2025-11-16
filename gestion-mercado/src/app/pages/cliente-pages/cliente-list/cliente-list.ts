import { Component, inject } from '@angular/core';
import { ClienteService } from '../../../services/cliente-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cliente-list',
  imports: [RouterLink],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css',
})
export class ClienteList {
service=inject(ClienteService);
clientes=this.service.clientes;
router=inject(Router);


eliminarCliente(id:number){
  if(confirm("¿Desea eliminar este cliente?")){
  this.service.eliminar(id).subscribe(()=>{
  console.log(`Cliente con el id:${id} eliminado`);
  })
  }
}









}
