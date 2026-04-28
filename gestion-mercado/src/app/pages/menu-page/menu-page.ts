import { Theme } from './../../styles/theme.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ThemeService } from '../../styles/theme.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './menu-page.html',
  styleUrl: './menu-page.css',
})
export class MenuPage {
 public authService=inject(AuthService);
  constructor(public auth: AuthService , public theme: ThemeService) { }

  get currentRole(): string | null {
    return this.auth.getRole();
  }



}
