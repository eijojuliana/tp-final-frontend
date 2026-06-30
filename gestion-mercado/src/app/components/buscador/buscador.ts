import { Component, Input, Output, EventEmitter, HostListener, ElementRef, inject, OnInit } from '@angular/core';
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
export class BuscadorGenericoComponent implements OnInit {
  @Input() datos: BuscadorItem[] = [];
  @Input() placeholder: string = 'Buscar...';
  @Input() mostrarImagen: boolean = false;
  @Input() valorInicial: string = '';

  @Output() alSeleccionar = new EventEmitter<number | string>();

  public textoBusqueda: string = '';
  public resultadosFiltrados: BuscadorItem[] = [];
  public mostrarDropdown: boolean = false;
  private itemSeleccionado: boolean = false;

  ngOnInit() {
    if (this.valorInicial) {
      this.textoBusqueda = this.valorInicial;
    }
  }

  private elementRef = inject(ElementRef);

  public alEscribir(): void {
    this.itemSeleccionado = false;
    const textoLimpio = this.textoBusqueda.toLowerCase().trim();

    this.resultadosFiltrados = this.datos.filter(item =>
      item.textoPrincipal.toLowerCase().includes(textoLimpio)
    );

    this.mostrarDropdown = true;
  }

  public seleccionarItem(item: BuscadorItem): void {
    this.itemSeleccionado = true;
    this.textoBusqueda = item.textoPrincipal;
    this.mostrarDropdown = false;
    this.alSeleccionar.emit(item.id);
  }

  public limpiar(): void {
    this.itemSeleccionado = false;
    this.textoBusqueda = '';
    this.resultadosFiltrados = [];
    this.mostrarDropdown = false;
  }

  public setValor(texto: string): void {
    this.textoBusqueda = texto;
    this.itemSeleccionado = !!texto;
    this.mostrarDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  public hacerClicAfuera(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.mostrarDropdown = false;
      if (!this.itemSeleccionado && !this.valorInicial) {
        this.textoBusqueda = '';
      }
    }
  }
}
