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
import { UsuariosList } from './pages/usuarios-pages/usuarios-list/usuarios-list';
import { UsuarioForm } from './pages/usuarios-pages/usuario-form/usuario-form';
import { DueniosList } from './pages/duenios-pages/duenios-list/duenios-list';
import { DuenioForm } from './pages/duenios-pages/duenio-form/duenio-form';
import { EmpleadoList } from './pages/empleado-pages/empleado-list/empleado-list';
import { EmpleadoForm } from './pages/empleado-pages/empleado-form/empleado-form';

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

  // Rutas de la Tienda
  { path:'menu/tienda', component: TiendaPage },

  // Rutas usuarios
  {path:'menu/usuarios', component: UsuariosList},
  {path:'menu/usuarios/form', component: UsuarioForm},

  // Rutas duenios
  {path:'menu/duenios', component: DueniosList},
  {path:'menu/duenios/form', component: DuenioForm},

  //Rutas empleados
  { path: 'menu/empleados', component: EmpleadoList},
  { path: 'menu/empleados/form', component: EmpleadoForm},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
