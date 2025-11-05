import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import { LoginLayout } from './login-layout/login-layout';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [LoginLayout],
  imports: [CommonModule, AuthRoutingModule, FormsModule]
})
export class AuthModule { }