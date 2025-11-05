import { RouterModule, Routes } from '@angular/router';
import { LoginLayout } from './auth/login-layout/login-layout';
import { NgModule } from '@angular/core';
import { HomePage } from './pages/home-page/home-page';

export const routes: Routes = [
    // Ruta por defecto que dirige a /login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
    // Ruta del login
  { path: 'login', component: LoginLayout },
    // Ruta para página principal
    { path: 'home', component: HomePage },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }