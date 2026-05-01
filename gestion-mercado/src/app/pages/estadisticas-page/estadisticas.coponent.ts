
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, BaseChartDirective], //Si sale error, descargar esta libreria ``npm install ng2-charts chart.js --legacy-peer-deps``
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent implements OnInit {
  private http = inject(HttpClient);

  // Signal para los datos del backend
  stats = signal<any>(null);

  // Configuración de Gráfico de Torta
  public donutData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: ['#ff4d8d', '#7c4dff'] }]
  };

  // Configuración de Gráfico de Líneas (Tendencia)
  public lineData: ChartData<'line'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Ventas', borderColor: '#ff4d8d', tension: 0.4 },
      { data: [], label: 'Ganancias', borderColor: '#7c4dff', tension: 0.4 }
    ]
  };

  ngOnInit() {
    // Cargar con fechas por defecto (ej. último mes)
    this.cargarDatos('2024-01-01', '2024-12-31');
  }

  cargarDatos(inicio: string, fin: string) {
    const url = `http://localhost:8080/api/stats/dashboard?inicio=${inicio}&fin=${fin}`;
    this.http.get(url).subscribe((res: any) => {
      this.stats.set(res);

      // Mapear datos a gráficos
      this.donutData.labels = res.ventasPorMetodo.map((m: any) => m.label);
      this.donutData.datasets[0].data = res.ventasPorMetodo.map((m: any) => m.value);

      this.lineData.labels = res.tendenciaVentas.map((t: any) => t.mes);
      this.lineData.datasets[0].data = res.tendenciaVentas.map((t: any) => t.ventas);
      this.lineData.datasets[1].data = res.tendenciaVentas.map((t: any) => t.ganancias);
    });
  }
}
