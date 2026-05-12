import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router'; 
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { ToastComponent } from "./components/toast-component/toast.component";
import { BreadcrumbComponent } from './components/breadcrumb.component/breadcrumb.component';
import { Sidebar } from './components/sidebar/sidebar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
    Footer,
    BreadcrumbComponent,
    Sidebar,
    CommonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gestion-mercado');

  constructor(private router: Router) {}

  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }
}
