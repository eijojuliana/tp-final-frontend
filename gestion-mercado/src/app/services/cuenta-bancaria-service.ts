import { Injectable, signal } from '@angular/core';
import { CuentaBancaria, newCuentaBancaria } from '../models/cuentaBancaria.model';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CuentaBancariaService {
  private url = "http://localhost:8080/api/cuenta_bancarias";

  private cuentaBancariaState = signal<CuentaBancaria[]>([]);
  public cuentasBancarias = this.cuentaBancariaState.asReadonly();

  private cuentaBancariaToEditState = signal<CuentaBancaria | null>(null);
  public cuentaBancariaToEdit = this.cuentaBancariaToEditState.asReadonly();

  constructor(private http:HttpClient) { this.load(); }

  load() {
    this.http.get<CuentaBancaria[]>(this.url).subscribe(data =>
      this.cuentaBancariaState.set(data)
    )
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

  seleccionarCuentaBancariaToEdit(cuentaBancaria:CuentaBancaria) {
    this.cuentaBancariaToEditState.set(cuentaBancaria);
  }

  limpiarCuentaBancariaToEdit() {
    this.cuentaBancariaToEditState.set(null);
  }
}
