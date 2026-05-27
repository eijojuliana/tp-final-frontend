import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PedidoPersistenceService {
  private formData: any = null;

  saveState(data: any) {
    this.formData = data;
  }

  getState() {
    return this.formData;
  }

  clearState() {
    this.formData = null;
  }
}
