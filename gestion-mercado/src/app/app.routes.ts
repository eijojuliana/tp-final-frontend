import { RouterModule, Routes } from '@angular/router';
import { LoginLayout } from './auth/login-layout/login-layout';
import { NgModule } from '@angular/core';
import { HomePage } from './pages/home-page/home-page';
import { ProductList } from './pages/product-pages/product-list/product-list';
import { PersonaList } from './pages/persona-pages/persona-list/persona-list';
import { ProductRegister } from './components/product-register/product-register';
import { LotesList } from './lote-pages/lotes-list/lotes-list';

export const routes: Routes = [
    // Ruta por defecto que dirige a /login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
    // Ruta del login
  { path: 'login', component: LoginLayout },
    // Ruta para página principal
    { path: 'home', component: HomePage },

    // Rutas productos
    { path: 'products', component: ProductList},
    { path: 'product-register', component: ProductRegister},

    // Rutas lotes
    { path:'lotes', component: LotesList },

    { path: 'personas', component: PersonaList },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
