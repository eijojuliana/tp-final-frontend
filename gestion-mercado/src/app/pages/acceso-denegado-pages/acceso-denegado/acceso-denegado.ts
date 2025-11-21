import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { MenuPage } from '../../menu-page/menu-page';

@Component({
  selector: 'app-acceso-denegado',
  imports: [],
  templateUrl: './acceso-denegado.html',
  styleUrl: './acceso-denegado.css',
})
export class AccesoDenegado {

  public route=inject(Router);
  public auth=inject(AuthService);



  cerrarSesion(){
    this.auth.clearCredentials();
    this.route.navigate(['/login']);
  }

  menu(){
    this.route.navigate(['/menu']);
  }





  
}
