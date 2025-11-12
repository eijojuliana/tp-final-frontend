import { RouterModule, Routes } from '@angular/router';
import { LoginLayout } from './auth/login-layout/login-layout';
import { NgModule } from '@angular/core';
import { HomePage } from './pages/home-page/home-page';
import { ProductList } from './pages/product-pages/product-list/product-list';
import { PersonaList } from './pages/persona-pages/persona-list/persona-list';
import { ProductRegister } from './components/product-register/product-register';
import { LotesList } from './pages/lote-pages/lotes-list/lotes-list';
import { LotesForm } from './pages/lote-pages/lotes-form/lotes-form';
import { InventariosList } from './pages/inventario-pages/inventarios-list/inventarios-list';
import { InventariosForm } from './pages/inventario-pages/inventarios-form/inventarios-form';
import { PersonaForm } from './pages/persona-pages/persona-form/persona-form';

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
    { path:'lotes-form', component: LotesForm },

    // Rutas inventarios
    { path:'inventarios', component: InventariosList},
    { path:'inventarios-form', component:InventariosForm},

    { path: 'personas', component: PersonaList },
    { path:'persona-form',component:PersonaForm}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
