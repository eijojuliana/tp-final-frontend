import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu-page.html',
  styleUrl: './menu-page.css',
})
export class MenuPage {

constructor(
    public auth: AuthService   // 👈 público para usar en el HTML
  ) {}


}
