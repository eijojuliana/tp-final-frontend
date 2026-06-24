import { Component, inject, signal, OnInit } from '@angular/core';
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
export class EstadisticasComponent implements OnInit {

  private http = inject(HttpClient);
  rangoSeleccionado = signal<string>('mes');
  public donutPlugins = [centerTextPlugin];

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

  // Signal para los datos del backend (contiene todo este tanto kpi base como avanzados)
  stats = signal<any>(null);

  // TOP 5 PRODUCTITOS
  public barData: ChartData<'bar'> = { labels: [], datasets: [] };
  public barOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { beginAtZero: true, ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      y: { ticks: { color: 'white' }, grid: { display: false } }
    },
    plugins: { legend: { display: false } }
  };

  ngOnInit() {
    this.seleccionarRango('mes'); // Carga el mes actual por defecto
  }

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
    this.cargarDatos(inicio, fin);
  }

  cargarDatos(inicio: string, fin: string) {
    const url = `${environment.apiBaseUrl}/stats/dashboard?inicio=${inicio}&fin=${fin}`;
    this.http.get(url).subscribe((res: any) => {
      if (!res) return;
      if (res.mejorMes) res.mejorMes = this.traducirMes(res.mejorMes);
      this.stats.set(res);

      // Actualizar Gráfico de Torta
      this.donutData = {
        labels: (res.ventasPorMetodo || []).map((m: any) => m.label),
        datasets: [{
          data: (res.ventasPorMetodo || []).map((m: any) => m.value),
          backgroundColor: ['#ff4d8d', '#7c4dff']
        }]
      };

      // Actualizar gráfico de los 5 más vendiditos
      this.barData = {
        labels: (res.topProductos || []).map((p: any) => p.label),
        datasets: [{
          data: (res.topProductos || []).map((p: any) => p.value),
          backgroundColor: '#7c4dff',
          borderRadius: 6
        }]
      };
      this.barOptions = { ...this.barOptions };
    });
  }

  // Configuración de Gráfico de Torta
  public donutData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#ff4d8d', '#7c4dff'] }]
  };

  public donutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: 'white', padding: 20 }
      }
    },
    cutout: '70%'
  };

}

const centerTextPlugin = {
  id: 'centerText',
  afterDraw: (chart: any) => {
    const { ctx, chartArea: { top, width, height } } = chart;
    ctx.save();
    const total = chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
    const text = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(total);
    const maxW = Math.min(width, height) * 0.55;
    let fontSize = 2.5;
    ctx.font = `bold ${fontSize}rem Poppins`;
    if (ctx.measureText(text).width > maxW) {
      fontSize = Math.max(0.7, fontSize * (maxW / ctx.measureText(text).width));
      ctx.font = `bold ${fontSize}rem Poppins`;
    }
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, (height / 2) + top + 10);
    ctx.restore();
  }
};
