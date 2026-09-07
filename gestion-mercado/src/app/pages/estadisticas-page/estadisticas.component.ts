import { Component, computed, inject, signal, OnInit, ElementRef, ViewChildren, QueryList, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChartData } from 'chart.js';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { environment } from '../../services/ip';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, BaseChartDirective], //Si sale error, descargar esta libreria ``npm install ng2-charts chart.js --legacy-peer-deps``
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent implements OnInit, AfterViewInit, OnDestroy {

  private http = inject(HttpClient); //HTTP para pedir los datos a la api
  private el = inject(ElementRef); //ElementRef para leer las variables de CSS del componente
  rangoSeleccionado = signal<string>('mes'); //rango por defecto: mes
  fechaInicio = signal<string>('');
  fechaFin = signal<string>('');

  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>; //Referencias a los lienzos para forzar actualización

  private observer: MutationObserver | null = null; //Observador que mira si cambia el tema (clase en <html>)

  //Titulo del gráfico de barras (top 5) según el rango de fecha seleccionado
  tituloTop5 = computed(() => {
    const r = this.rangoSeleccionado();
    if (r === 'hoy') return 'Top 5 más vendidos hoy';
    if (r === 'mes') return 'Top 5 más vendidos del mes';
    if (r === 'año') return 'Top 5 más vendidos del año';
    if (r === 'todo') return 'Top 5 más vendidos (histórico)';
    return `Top 5 más vendidos del ${this.fechaInicio()} al ${this.fechaFin()}`;
  });

  //Titulo del gráfico de torta (efectivo vs transferencia) según el rango de fecha seleccionado
  tituloVentas = computed(() => {
    const r = this.rangoSeleccionado();
    if (r === 'hoy') return 'Ventas: efectivo VS transferencia hoy';
    if (r === 'mes') return 'Ventas: efectivo VS transferencia del mes';
    if (r === 'año') return 'Ventas: efectivo VS transferencia del año';
    if (r === 'todo') return 'Ventas: efectivo VS transferencia (histórico)';
    return 'Ventas: efectivo VS transferencia';
  });

  //Plugin de chart.js para dibujar el total de dinero en el centro de la torta
  //Usa una arrow function para mantener el this del componente y poder leer las variables CSS
  private centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart: any) => {
      const { ctx, chartArea: { top, width, height } } = chart;
      ctx.save();
      const total = chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
      ctx.font = 'bold 2.5rem Poppins';
      ctx.fillStyle = this.cssVar('--chart-text') || '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(total), width / 2, (height / 2) + top + 10);
      ctx.restore();
    }
  };

  //Plugins que se le pasan al gráfico de torta (el del texto centrado)
  public donutPlugins = [this.centerTextPlugin];

  //Traducción de nombres de meses en ingles (vienen de la api) a español
  private mesesEn: Record<string, string> = {
    january: 'Enero', jan: 'Enero',
    february: 'Febrero', feb: 'Febrero',
    march: 'Marzo', mar: 'Marzo',
    april: 'Abril', apr: 'Abril',
    may: 'Mayo',
    june: 'Junio', jun: 'Junio',
    july: 'Julio', jul: 'Julio',
    august: 'Agosto', aug: 'Agosto',
    september: 'Septiembre', sep: 'Septiembre',
    october: 'Octubre', oct: 'Octubre',
    november: 'Noviembre', nov: 'Noviembre',
    december: 'Diciembre', dec: 'Diciembre'
  };

  private traducirMes(valor: string): string {
    if (!valor) return valor;
    const lower = valor.toLowerCase().trim();
    return this.mesesEn[lower] || valor;
  }

  //Signal que guarda todos los datos que vienen de la api (kpis, gráficos, etc)
  stats = signal<any>(null);

  //Lee una variable CSS del componente (las definidas en styles.css :root / :root.tema-oscuro)
  private cssVar(name: string): string {
    return getComputedStyle(this.el.nativeElement).getPropertyValue(name).trim();
  }

  //Obtiene los colores de las variables CSS definidas en styles.css
  //Al leerlos en tiempo real con getComputedStyle, respetan el tema activo (claro/oscuro)
  private get color1(): string {
    return this.cssVar('--chart-color-1') || '#ff4d8d';
  }

  //Color 2 para las barras y segundo sector de la torta
  private get color2(): string {
    return this.cssVar('--chart-color-2') || '#7c4dff';
  }

  //Color 3 para futuros sectores adicionales en la torta
  private get color3(): string {
    return this.cssVar('--chart-color-3') || '#06d6a0';
  }

  //Crea las opciones del gráfico de barras (horizontal) leyendo colores desde las variables CSS
  private crearBarOptions(): ChartConfiguration<'bar'>['options'] {
    const tc = this.cssVar('--chart-text') || '#333';
    const gc = this.cssVar('--chart-grid') || 'rgba(0, 0, 0, 0.1)';
    return {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      color: tc,
      scales: {
        x: { beginAtZero: true, ticks: { color: tc }, grid: { color: gc }, border: { color: tc } },
        y: { ticks: { color: tc }, grid: { display: false }, border: { color: tc } }
      },
      plugins: { legend: { display: false } }
    };
  }

  //Datos y opciones del gráfico de barras (top 5 productos más vendidos)
  public barData: ChartData<'bar'> = { labels: [], datasets: [] };
  public barOptions: ChartConfiguration<'bar'>['options'] = {};

  ngOnInit() {
    this.barOptions = this.crearBarOptions();
    this.donutOptions = this.crearDonutOptions();
    this.donutData = {
      labels: [],
      datasets: [{ data: [], backgroundColor: [this.color1, this.color2, this.color3] }]
    };
    this.seleccionarRango('mes');
  }

  //Cuando el componente termina de renderizar, creamos un MutationObserver
  //que mira si la clase del <html> cambia (tema-oscuro se agrega o se quita).
  //Si cambia, aplicamos los colores del nuevo tema a los gráficos.
  ngAfterViewInit() {
    this.observer = new MutationObserver(() => this.aplicarTema());
    this.observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  //Limpiamos el observer cuando el componente se destruye para evitar memory leaks
  ngOnDestroy() {
    this.observer?.disconnect();
  }

  //Vuelve a leer las variables CSS (que ya cambiaron por el nuevo tema) y actualiza
  //las opciones y datos de los gráficos, forzando un re-render con chart.update()
  private aplicarTema() {
    this.barOptions = this.crearBarOptions();
    this.donutOptions = this.crearDonutOptions();

    if (this.stats()) {
      this.donutData = {
        ...this.donutData,
        datasets: [{ ...this.donutData.datasets[0], backgroundColor: [this.color1, this.color2, this.color3] }]
      };
      this.barData = {
        ...this.barData,
        datasets: [{ ...this.barData.datasets[0], backgroundColor: this.color2 }]
      };
    }

    //Usamos setTimeout para esperar a que Angular propague los cambios en los inputs
    //y después forzamos el update de chart.js para que pinte con los colores nuevos
    setTimeout(() => {
      this.charts?.forEach(c => c.update());
    });
  }

  //Método llamado por los botones de rango (hoy, mes, año, todo) y por los inputs de fecha
  seleccionarRango(rango: string) {
    this.rangoSeleccionado.set(rango);
    const fecha = new Date();
    const hoy = fecha.toLocaleDateString('en-CA');
    let inicio = hoy;
    let fin = hoy;

    switch (rango) {
      case 'hoy':
        break;
      case 'mes':
        const primero = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
        inicio = primero.toLocaleDateString('en-CA');
        break;
      case 'año':
        inicio = `${new Date().getFullYear()}-01-01`;
        break;
      case 'todo':
        inicio = '2000-01-01';
        break;
    }
    this.fechaInicio.set(inicio);
    this.fechaFin.set(fin);
    this.cargarDatos(inicio, fin);
  }

  //Llama a la api para traer los datos del dashboard según el rango de fecha
  //y actualiza todos los gráficos y kpis con los valores que devuelve el backend
  cargarDatos(inicio: string, fin: string) {
    const url = `${environment.apiBaseUrl}/stats/dashboard?inicio=${inicio}&fin=${fin}`;
    this.http.get(url).subscribe((res: any) => {
      if (!res) return;
      if (res.mejorMes) res.mejorMes = this.traducirMes(res.mejorMes);
      this.stats.set(res);

      //Actualiza el gráfico de torta (efectivo vs transferencia) con los colores del tema actual
      this.donutData = {
        labels: (res.ventasPorMetodo || []).map((m: any) => m.label),
        datasets: [{
          data: (res.ventasPorMetodo || []).map((m: any) => m.value),
          backgroundColor: [this.color1, this.color2, this.color3]
        }]
      };

      //Actualiza el gráfico de barras (top 5 productos) con el color principal del tema actual
      this.barData = {
        labels: (res.topProductos || []).map((p: any) => p.label),
        datasets: [{
          data: (res.topProductos || []).map((p: any) => p.value),
          backgroundColor: this.color2,
          borderRadius: 6
        }]
      };
      //Recreamos las opciones para que tomen los colores de texto y grilla del tema actual
      this.barOptions = this.crearBarOptions();
      this.donutOptions = this.crearDonutOptions();
    });
  }

  private crearDonutOptions(): ChartConfiguration<'doughnut'>['options'] {
    const tc = this.cssVar('--chart-text') || '#333';
    return {
      responsive: true,
      maintainAspectRatio: false,
      color: tc,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: tc, padding: 20 }
        }
      },
      cutout: '70%'
    };
  }

  //Datos del gráfico de torta (ventas por método de pago: efectivo / transferencia)
  public donutData: ChartData<'doughnut'> = { labels: [], datasets: [] };

  //Opciones del gráfico de torta (leyenda, colores de texto, etc)
  public donutOptions: ChartConfiguration<'doughnut'>['options'] = {};

}
