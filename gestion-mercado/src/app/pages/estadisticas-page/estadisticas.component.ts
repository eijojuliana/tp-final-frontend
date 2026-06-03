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
      this.stats.set(res);

      // Actualizar Gráfico de Torta
      this.donutData = {
        labels: (res.ventasPorMetodo || []).map((m: any) => m.label),
        datasets: [{
          data: (res.ventasPorMetodo || []).map((m: any) => m.value),
          backgroundColor: ['#ff4d8d', '#7c4dff']
        }]
      };

      // Actualizar Gráfico de Líneas
      this.lineData = {
        labels: (res.tendenciaVentas || []).map((t: any) => t.mes),
        datasets: [
          {
            data: (res.tendenciaVentas || []).map((t: any) => t.ventas),
            label: 'Ventas',
            borderColor: '#ff4d8d',
            backgroundColor: 'rgba(255, 77, 141, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            data: (res.tendenciaVentas || []).map((t: any) => t.ganancias),
            label: 'Ganancias',
            borderColor: '#7c4dff',
            backgroundColor: 'rgba(124, 77, 255, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      };
      this.lineOptions = { ...this.lineOptions };

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

  // Configuración de Gráfico de Líneas (Tendencia)
  public lineData: ChartData<'line'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Ventas', borderColor: '#ff4d8d', tension: 0.4 },
      { data: [], label: 'Ganancias', borderColor: '#7c4dff', tension: 0.4 }
    ]
  };

  public lineOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: 'white' },
        grid: { display: false }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: 'white', padding: 20 }
      }
    }
  };
}

const centerTextPlugin = {
  id: 'centerText',
  afterDraw: (chart: any) => {
    const { ctx, chartArea: { top, width, height } } = chart;
    ctx.save();
    const total = chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
    ctx.font = 'bold 2.5rem Poppins';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(total), width / 2, (height / 2) + top + 10);
    ctx.restore();
  }
};
