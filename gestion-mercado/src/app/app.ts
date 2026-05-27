import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { ToastComponent } from "./components/toast-component/toast.component";
import { BreadcrumbComponent } from './components/breadcrumb.component/breadcrumb.component';
import { Sidebar } from './components/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { ThemeService } from './styles/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
    Footer,
    BreadcrumbComponent,
    Sidebar,
    CommonModule,
    ToastComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  animating = false;

  protected readonly title = signal('gestion-mercado');

  constructor(private router: Router, public theme: ThemeService) {}

  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }

  ngOnInit(): void {
    this.theme.init();
  }

  toggleTheme(): void {
    this.animating = true;
    this.theme.toggle();
    setTimeout(() => (this.animating = false), 200);
  }
}
