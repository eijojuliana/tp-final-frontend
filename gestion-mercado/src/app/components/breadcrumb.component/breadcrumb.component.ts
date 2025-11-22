import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
})
export class BreadcrumbComponent {

  crumbs: { label: string, url: string }[] = [];

  // Nombres de cada módulo
  private labels: Record<string, string> = {
    menu: 'Menu',
    productos: 'Productos',
    empleados: 'Empleados',
    clientes: 'Clientes',
    lotes: 'Lotes',
    inventarios: 'Inventarios',
    usuarios: 'Usuarios',
    proveedores: 'Proveedores',
    pedidos: 'Pedidos',
    transacciones: 'Transacciones',
    'cuentas-bancarias': 'Cuentas Bancarias',
    personas: 'Personas',
    tienda: 'Tienda',
  };

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.buildBreadcrumbs());
  }

  buildBreadcrumbs() {
    const url = this.router.url;

    // ESTO ES PARA SOLO MOSTRAR SI EMPIEZA CON MENU (así no se ve el login xd)
    if (!url.startsWith('/menu')) {
      this.crumbs = [];
      return;
    }

    const parts = url.split('/').filter(p => p !== '');
    let accumulated = '';

    this.crumbs = parts.map((part, index) => {
      accumulated += '/' + part;

      let label = this.labels[part] || part.toUpperCase();

      if (part === 'form') {
        const moduleName = this.labels[parts[index - 1]] || 'Item';
        label = `Formulario ${moduleName}`;
      }

      return { label, url: accumulated };
    });
  }
}
