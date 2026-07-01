import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 1;

  show(message: string, type: ToastType = 'info', duration: number = 2800) {
    const id = this.nextId++;
    this.toasts.update((current) => [...current, { id, message, type }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  dismiss(id: number) {
    this.toasts.update((current) => current.filter((toast) => toast.id !== id));
  }
}
