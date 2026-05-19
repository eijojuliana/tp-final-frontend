import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {

  toasts = signal<{ message: string, type: 'error' | 'success' | 'warning'}[]>([]);

  private addToast(message: string, type: 'error' | 'success' | 'warning') {
    const toastObj = { message, type };

    this.toasts.update(arr => [...arr, toastObj]);

    setTimeout(() => {
      this.toasts.update(arr =>
        arr.filter(t => t !== toastObj)
      );
    }, 3000);
  }

  error(message: string) {
    this.addToast(message, 'error');
  }

  success(message: string) {
    this.addToast(message, 'success');
  }

  warning(message: string) {
    this.addToast(message, 'warning');
  }
}
