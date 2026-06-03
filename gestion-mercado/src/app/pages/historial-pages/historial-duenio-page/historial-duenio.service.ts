import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../services/ip';

@Injectable({ providedIn: 'root' })
export class HistorialDuenioService {
  private apiurls = environment.apiBaseUrl + "/historial/duenios";
  constructor(private http: HttpClient) {}

  getHistorial(sortBy: string, order: string, filter: string): Observable<any[]> {
    let params = new HttpParams().set('sortBy', sortBy).set('order', order).set('filter', filter);
    return this.http.get<any[]>(this.apiurls, { params });
  }
}
