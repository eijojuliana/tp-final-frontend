import { RouterModule, Routes } from '@angular/router';
import { LoginLayout } from './auth/login-layout/login-layout';
import { NgModule } from '@angular/core';
import { ProductList } from './pages/product-pages/product-list/product-list';
import { PersonaList } from './pages/persona-pages/persona-list/persona-list';
import { LotesList } from './pages/lote-pages/lotes-list/lotes-list';
import { LotesForm } from './pages/lote-pages/lotes-form/lotes-form';
import { InventariosList } from './pages/inventario-pages/inventarios-list/inventarios-list';
import { InventariosForm } from './pages/inventario-pages/inventarios-form/inventarios-form';
import { PersonaForm } from './pages/persona-pages/persona-form/persona-form';
import { CuentasBancariasList } from './pages/cuentaBancaria-pages/cuentas-bancarias-list/cuentas-bancarias-list';
import { CuentasBancariasForm } from './pages/cuentaBancaria-pages/cuentas-bancarias-form/cuentas-bancarias-form';
import { MenuPage } from './pages/menu-page/menu-page';
import { ProductRegister } from './pages/product-pages/product-form/product-form';
import { TiendaPage } from './pages/tienda-pages/tienda-page/tienda-page';

export const routes: Routes = [
  // Ruta por defecto que dirige a /login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Ruta del login
  { path: 'login', component: LoginLayout },
  // Ruta para página principal
  { path: 'menu', component: MenuPage },

  // Rutas productos
  { path: 'menu/productos', component: ProductList},
  { path: 'menu/productos/form', component: ProductRegister},

  // Rutas lotes
  { path:'menu/lotes', component: LotesList },
  { path:'menu/lotes/form', component: LotesForm },

  // Rutas inventarios
  { path:'menu/inventarios', component: InventariosList},
  { path:'menu/inventarios/form', component:InventariosForm},

  // Rutas personas
  { path:'menu/personas', component: PersonaList },
  { path:'menu/personas/form',component:PersonaForm},

  // Rutas de Cuentas Bancarias
  {path:'menu/cuentas-bancarias', component: CuentasBancariasList},
  {path:'menu/cuentas-bancarias/form', component: CuentasBancariasForm},

  { path:'menu/tienda-page', component: TiendaPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
