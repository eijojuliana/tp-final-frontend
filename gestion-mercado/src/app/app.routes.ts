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
import { ClienteForm } from './pages/cliente-pages/cliente-form/cliente-form';
import { ClienteList } from './pages/cliente-pages/cliente-list/cliente-list';
import { TransaccionesList } from './pages/transacciones-pages/transacciones-list/transacciones-list';
import { TransaccionForm } from './pages/transacciones-pages/transaccion-form/transaccion-form';
import { PedidosList } from './pages/pedido-pages/pedidos-list/pedidos-list';
import { PedidosForm } from './pages/pedido-pages/pedidos-form/pedidos-form';
import { ProveedoresList } from './pages/proveedor-pages/proveedores-list/proveedores-list';
import { ProveedoresForm } from './pages/proveedor-pages/proveedores-form/proveedores-form';
import { authGuard } from './auth/guard/auth.guard';
import { AccesoDenegado } from './pages/acceso-denegado-pages/acceso-denegado/acceso-denegado';
import { YaLogueado } from './pages/ya-logueado-page/ya-logueado/ya-logueado';

export const routes: Routes = [
  // Ruta por defecto que dirige a /login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Ruta del login
  { path: 'login', component: LoginLayout },

  { path: 'ya-logueado', component: YaLogueado,canActivate:[authGuard]},

  // Ruta para página principal
  { path: 'menu', component: MenuPage, canActivate:[authGuard]},

  // Rutas productos
  { path: 'menu/productos', component: ProductList,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']}},
  { path: 'menu/productos/form', component: ProductRegister,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']}},

  // Rutas lotes
  { path:'menu/lotes', component: LotesList,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']} },
  { path:'menu/lotes/form', component: LotesForm,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']} },

  // Rutas inventarios
  { path:'menu/inventarios', component: InventariosList,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']}},
  { path:'menu/inventarios/form', component:InventariosForm,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']}},

  // Rutas personas
  { path:'menu/personas', component: PersonaList,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']} },
  { path:'menu/personas/form',component:PersonaForm,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']}},

  // Rutas de Cuentas Bancarias
  {path:'menu/cuentas-bancarias', component: CuentasBancariasList,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']}},
  {path:'menu/cuentas-bancarias/form', component: CuentasBancariasForm,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO']}},

  // Rutas de la Tienda
  { path:'menu/tienda', component: TiendaPage ,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO']}},

  // Rutas usuarios
  {path:'menu/usuarios', component: UsuariosList, canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']}},
  {path:'menu/usuarios/form', component: UsuarioForm,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO']}},

  // Rutas duenios
  {path:'menu/duenios', component: DueniosList,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO']}},
  {path:'menu/duenios/form', component: DuenioForm,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO']}},

  //Rutas empleados
  { path: 'menu/empleados', component: EmpleadoList,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']}},
  { path: 'menu/empleados/form', component: EmpleadoForm,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO']}},

  //Rutas clientes
  { path: 'menu/clientes', component: ClienteList,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']}},
  { path: 'menu/clientes/form', component: ClienteForm,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']}},

  //Rutas transacciones
  { path: 'menu/transacciones', component: TransaccionesList,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']}},
  { path: 'menu/transacciones/form', component: TransaccionForm,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']}},

  //Rutas pedidos
  { path: 'menu/pedidos', component: PedidosList,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']}},
  { path: 'menu/pedidos/form', component: PedidosForm,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']}},
  { path: 'menu/pedidos/form/:id', component: PedidosForm, canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']}},

  //Rutas proveedores
  {path: 'menu/proveedores', component: ProveedoresList,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']}},
  {path: 'menu/proveedores/form', component: ProveedoresForm,canActivate:[authGuard], data:{roles:['ADMIN','DUENIO','EMPLEADO']}},

  //Acceso denegado
  { path: 'acceso-denegado', component: AccesoDenegado },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

