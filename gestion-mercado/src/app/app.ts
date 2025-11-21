import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { ToastComponent } from "./components/toast-component/toast.component";
import { BreadcrumbComponent } from './components/breadcrumb.component/breadcrumb.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ToastComponent, BreadcrumbComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gestion-mercado');
}
