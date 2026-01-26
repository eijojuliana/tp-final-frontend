import { Injectable } from '@angular/core';

export type Theme = 'sakura' | 'oscuro';
const STORAGE_KEY = 'theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private theme: Theme = 'sakura';

  init(): void {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    this.theme = saved ?? 'sakura';
    this.apply(this.theme);
  }

  toggle(): void {
    this.theme = this.theme === 'oscuro' ? 'sakura' : 'oscuro';
    this.apply(this.theme);
    localStorage.setItem(STORAGE_KEY, this.theme);
  }

  isOscuro(): boolean {
    return this.theme === 'oscuro';
  }

  isSakura(): boolean {
    return this.theme === 'sakura';
  }

  private apply(theme: Theme): void {
    const root = document.documentElement;
    root.classList.toggle('tema-oscuro', theme === 'oscuro');
    root.style.colorScheme = theme === 'oscuro' ? 'dark' : 'light';
  }
}
