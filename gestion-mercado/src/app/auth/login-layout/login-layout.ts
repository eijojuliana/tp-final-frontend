import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-login-layout',
  standalone: false,
  templateUrl: './login-layout.html',
  styleUrl: './login-layout.css',
})
export class LoginLayout {
  username: string = '';
  password: string = '';

  constructor() { }

  login(): void {
    console.log('Intento de login:', this.username);
  }
}
