import { Injectable, signal } from '@angular/core';
import { Lote, newLote } from '../models/lote.model';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from './ip';

@Injectable({
  providedIn: 'root',
})
export class LoteService {
  private url = environment.apiBaseUrl + "/lotes";

  private loteState = signal<Lote[]>([]);
  public lotes = this.loteState.asReadonly();

  private loteToEditState = signal<Lote | null>(null);
  public loteToEdit = this.loteToEditState.asReadonly();

  constructor(private http:HttpClient) { this.load() }

  load() {
    this.http.get<Lote[]>(this.url).subscribe(data =>
      this.loteState.set(data)
    )
  }

  post(lote:newLote):Observable<Lote> {
    return this.http.post<Lote>(this.url, lote).pipe(
      tap( () => this.load() )
    );
  }

  delete(id:number):Observable<Lote> {
    return this.http.delete<Lote>(`${this.url}/${id}`).pipe(
      tap(() => {
        this.loteState.update(currentLotes =>
          currentLotes.filter(l => l.lote_id !== id)
        )
      })
    )
  }

  update(lote:Lote):Observable<Lote> {
    return this.http.put<Lote>(`${this.url}/${lote.lote_id}`, lote).pipe(
      tap( () => this.load() )
    );
  }

  // METODOS PARA EDITAR DESPUES
  selectLoteToEdit(lote:Lote) {
    this.loteToEditState.set(lote);
  }

  clearLoteToEdit() {
    this.loteToEditState.set(null);
  }
}
