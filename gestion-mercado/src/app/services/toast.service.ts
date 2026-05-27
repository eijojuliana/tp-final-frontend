import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'warning';
  timeoutId?: any;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  // Duración de 5000ms = 5 segundos)
  private DEFAULT_DURATION = 5000;

  // Método para mostar los toast centralizado
  show(message: string, type: 'success' | 'error' | 'warning', duration = this.DEFAULT_DURATION) {
    const nuevoToast: Toast = { message, type };

    // Auto-eliminar después del tiempo configurado
    const timeoutId = setTimeout(() => {
      this.remove(nuevoToast);
    }, duration);

    nuevoToast.timeoutId = timeoutId;

    this.toasts.update(current => [...current, nuevoToast]);
  }

  success(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  warning(message: string, duration?: number) {
    this.show(message, 'warning', duration);
  }

  error(message: string, duration?: number) {
    this.show(message, 'error', duration);
  }

  remove(toastToRemove: Toast) {
    if (toastToRemove.timeoutId) {
      clearTimeout(toastToRemove.timeoutId); // Limpia el timer para evitar bugs
    }
    this.toasts.update(current => current.filter(t => t !== toastToRemove));
  }
}
