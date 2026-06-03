import { setupGuard } from './auth/guard/setup.guard';
import { RouterModule, Routes } from '@angular/router';
import { LoginLayout } from './auth/login-layout/login-layout';
import { NgModule } from '@angular/core';
import { ProductList } from './pages/product-pages/product-list/product-list';
import { PersonaList } from './pages/persona-pages/persona-list/persona-list';
import { LotesList } from './pages/lote-pages/lotes-list/lotes-list';
import { LotesForm } from './pages/lote-pages/lotes-form/lotes-form';
import { ProductRegister } from './pages/product-pages/product-form/product-form';
import { CuentasBancariasList } from './pages/cuentaBancaria-pages/cuentas-bancarias-list/cuentas-bancarias-list';
import { CuentasBancariasForm } from './pages/cuentaBancaria-pages/cuentas-bancarias-form/cuentas-bancarias-form';
import { MenuPage } from './pages/menu-page/menu-page';
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

import { PersonaForm } from './pages/persona-pages/persona-form/persona-form';
import { HistorialPersonaListComponent } from './pages/historial-pages/historial-persona-page/historial-persona-list';
import { HistorialClienteListComponent } from './pages/historial-pages/historial-cliente-page/historial-cliente-list';
import { HistorialUsuarioListComponent } from './pages/historial-pages/historial-usuario-page/historial-usuario-list';
import { HistorialProveedorListComponent } from './pages/historial-pages/historial-proveedor-page/historial-proveedor-list';
import { HistorialEmpleadoListComponent } from './pages/historial-pages/historial-empleado-page/historial-empleado-list';
import { HistorialDuenioListComponent } from './pages/historial-pages/historial-duenio-page/historial-duenio-list';
import { HistorialTiendaListComponent } from './pages/historial-pages/historial-tienda-page/historial-tienda-list';
import { HistorialProductoListComponent } from './pages/historial-pages/historial-producto-page/historial-producto-list';
import { HistorialInventarioListComponent } from './pages/historial-pages/historial-inventario-page/historial-inventario-list';
import { HistorialLoteListComponent } from './pages/historial-pages/historial-lote-page/historial-lote-list';
import { HistorialCuentaBancariaListComponent } from './pages/historial-pages/historial-cuentaBancaria-page/historial-cuenta-bancaria-list';
import { HistorialTransaccionListComponent } from './pages/historial-pages/historial-transaccion-page/historial-transaccion-list';
import { HistorialPedidoListComponent } from './pages/historial-pages/historial-pedido-page/historial-pedido-list';
import { HistorialDetallePedidoListComponent } from './pages/historial-pages/historial-detallePedido-page/historial-detalle-pedido-list';
import { EstadisticasComponent } from './pages/estadisticas-page/estadisticas.component';
import { CierreCajaComponent } from './pages/cierre-caja-page/cierre-caja.component';


// definimos guards en común
const AUTH_AND_SETUP = [authGuard];
const ADMIN_DUENIO_EMPLEADO = ['ADMIN','DUENIO','EMPLEADO'];
const ADMIN_DUENIO = ['ADMIN','DUENIO'];

export const routes: Routes = [
  // Ruta por defecto que dirige a /login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Ruta del login
  { path: 'login', component: LoginLayout },

  { path: 'ya-logueado', component: YaLogueado, canActivate:[authGuard]},

  // Ruta principal: sólo Auth Guard, ya no necesita setupGuard (así evitamos loops y errores)
  { path: 'menu', component: MenuPage, canActivate:[authGuard,setupGuard]},

  // Rutas productos
  { path: 'menu/productos', component: ProductList, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  { path: 'menu/productos/form', component: ProductRegister, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},

  // Rutas lotes
  { path:'menu/lotes', component: LotesList, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO} },
  { path:'menu/lotes/form', component: LotesForm, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO} },

  // Ruta inventarios (form unificado)
  { path:'menu/inventarios/form', component:ProductRegister, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},

  // Rutas personas
  { path:'menu/personas', component: PersonaList, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO} },
  { path:'menu/personas/form', component: PersonaForm, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO} },
  { path:'menu/historial/personas',component:HistorialPersonaListComponent, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},

  // Rutas de Cuentas Bancarias
  {path:'menu/cuentas-bancarias', component: CuentasBancariasList, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  {path:'menu/cuentas-bancarias/form', component: CuentasBancariasForm, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO}},

  // Rutas de la Tienda (Estas rutas SÍ deben estar protegidas)
  { path:'configuracion-tienda', component: TiendaPage , canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO}},

  // Rutas usuarios
  {path:'menu/usuarios', component: UsuariosList, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  {path:'menu/usuarios/form', component: UsuarioForm, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO}},
  { path:'menu/historial/usuarios',component:HistorialUsuarioListComponent, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  // Rutas duenios (Estas rutas SÍ deben estar protegidas)
  {path:'menu/duenios', component: DueniosList, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO}},
  {path:'menu/duenios/form', component: DuenioForm, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO}},

  //Rutas empleados
  { path: 'menu/empleados', component: EmpleadoList, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  { path: 'menu/empleados/form', component: EmpleadoForm, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO}},

  //Rutas clientes
  { path: 'menu/clientes', component: ClienteList, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  { path: 'menu/clientes/form', component: ClienteForm, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  { path:'menu/historial/clientes',component:HistorialClienteListComponent, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},

  { path:'menu/historial/proveedores',component:HistorialProveedorListComponent, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  { path:'menu/historial/empleados',component:HistorialEmpleadoListComponent, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  { path:'menu/historial/duenios',component:HistorialDuenioListComponent, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  { path:'menu/historial/tiendas',component:HistorialTiendaListComponent, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  { path:'menu/historial/productos',component:HistorialProductoListComponent, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  { path:'menu/historial/inventarios',component:HistorialInventarioListComponent, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  { path:'menu/historial/lotes',component:HistorialLoteListComponent, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  { path:'menu/historial/cuentas-bancarias',component:HistorialCuentaBancariaListComponent, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  { path:'menu/historial/transacciones',component:HistorialTransaccionListComponent, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  { path:'menu/historial/pedidos',component:HistorialPedidoListComponent, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  { path:'menu/historial/detalles-pedido',component:HistorialDetallePedidoListComponent, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  //Rutas transacciones
  { path: 'menu/transacciones', component: TransaccionesList, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  { path: 'menu/transacciones/form', component: TransaccionForm, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},

  //Rutas pedidos
  { path: 'menu/pedidos', component: PedidosList, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  { path: 'menu/pedidos/form', component: PedidosForm, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  { path: 'menu/pedidos/form/:id', component: PedidosForm, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},

  //Rutas proveedores
  {path: 'menu/proveedores', component: ProveedoresList, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},
  {path: 'menu/proveedores/form', component: ProveedoresForm, canActivate:AUTH_AND_SETUP, data:{roles:ADMIN_DUENIO_EMPLEADO}},

  //Acceso denegado
  { path: 'acceso-denegado', component: AccesoDenegado },

  // Estadisticas
  { path: 'menu/estadisticas', component: EstadisticasComponent },
  { path: 'menu/cierre-caja', component: CierreCajaComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
