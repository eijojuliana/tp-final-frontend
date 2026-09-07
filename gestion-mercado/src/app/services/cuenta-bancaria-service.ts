import { Injectable, signal } from '@angular/core';
import { CuentaBancaria, newCuentaBancaria } from '../models/cuentaBancaria.model';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from './ip';

@Injectable({
  providedIn: 'root',
})
export class CuentaBancariaService {
  private url = environment.apiBaseUrl + "/cuenta_bancarias";

  private cuentaBancariaState = signal<CuentaBancaria[]>([]);
  public cuentasBancarias = this.cuentaBancariaState.asReadonly();

  private cuentaBancariaToEditState = signal<CuentaBancaria | null>(null);
  public cuentaBancariaToEdit = this.cuentaBancariaToEditState.asReadonly();

  constructor(private http:HttpClient) { }

  load() {
    this.http.get<CuentaBancaria[]>(this.url).subscribe({
      next: data => this.cuentaBancariaState.set(data),
      error: () => {}
    });
  }

  // Actualiza el saldo de una cuenta de forma optimista (cambia al instante en
  // pantalla) y después re-sincroniza con el servidor para el valor real.
  aplicarCambioSaldo(cuentaId: number, delta: number): void {
    this.cuentaBancariaState.update(cuentas =>
      cuentas.map(c =>
        c.cuentaBancariaId === cuentaId
          ? { ...c, saldo: (Number(c.saldo) || 0) + delta }
          : c
      )
    );
    this.load();
  }

  post(cuentaBancaria:newCuentaBancaria):Observable<CuentaBancaria> {
    return this.http.post<CuentaBancaria>(this.url, cuentaBancaria).pipe(
      tap( () => this.load() )
    );
  }

  delete(id:number):Observable<CuentaBancaria> {
    return this.http.delete<CuentaBancaria>(`${this.url}/${id}`).pipe(
      tap(() => {
        this.cuentaBancariaState.update(currentCuentas =>
          currentCuentas.filter(c => c.cuentaBancariaId !== id)
        )
      })
    );
  }

  update(cuentaBancaria:CuentaBancaria):Observable<CuentaBancaria> {
    return this.http.put<CuentaBancaria>(`${this.url}/${cuentaBancaria.cuentaBancariaId}`, cuentaBancaria).pipe(
      tap( () => this.load() )
    );
  }

  selectCuentaBancariaToEdit(cuentaBancaria:CuentaBancaria) {
    this.cuentaBancariaToEditState.set(cuentaBancaria);
  }

  clearCuentaBancariaToEdit() {
    this.cuentaBancariaToEditState.set(null);
  }

  exportarExcel() {
    return this.http.get(`${this.url}/exportar`, {
      responseType: 'blob'
    }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte-cuentas-bancarias.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
