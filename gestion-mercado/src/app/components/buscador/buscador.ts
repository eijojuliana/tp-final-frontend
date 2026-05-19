import { Component, Input, Output, EventEmitter, HostListener, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuscadorItem } from './buscador-item';

@Component({
  selector: 'app-buscador-generico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscador.html',
  styleUrl: './buscador.css'
})
export class BuscadorGenericoComponent {
  @Input() datos: BuscadorItem[] = [];
  @Input() placeholder: string = 'Buscar...';
  @Input() mostrarImagen: boolean = false;

  @Output() alSeleccionar = new EventEmitter<number | string>();

  public textoBusqueda: string = '';
  public resultadosFiltrados: BuscadorItem[] = [];
  public mostrarDropdown: boolean = false;

  private elementRef = inject(ElementRef);

  public alEscribir(): void {
    const textoLimpio = this.textoBusqueda.toLowerCase().trim();

    this.resultadosFiltrados = this.datos.filter(item =>
      item.textoPrincipal.toLowerCase().includes(textoLimpio)
    );

    this.mostrarDropdown = true;
  }

  public seleccionarItem(item: BuscadorItem): void {
    this.textoBusqueda = item.textoPrincipal;
    this.mostrarDropdown = false;
    this.alSeleccionar.emit(item.id);
  }

  @HostListener('document:click', ['$event'])
  public hacerClicAfuera(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.mostrarDropdown = false;
    }
  }
}
