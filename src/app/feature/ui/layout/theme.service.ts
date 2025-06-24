import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { SharedLocalStorageService } from '../../../shared/services/local-storage.service';

const THEME_STORAGE_KEY = 'theme';
enum Theme {
  DARK = 'gruvbox',
  LIGHT = 'pastel',
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly localStorage = inject(SharedLocalStorageService);
  private readonly theme = signal<Theme>(this.getInitialTheme());

  readonly #htmlElement = document.documentElement;
  readonly isDark = computed(() => this.theme() === Theme.DARK);

  constructor() {
    effect(() => this.applyTheme(this.theme()));
  }

  toggleTheme(): void {
    this.theme.update(current =>
      current === Theme.DARK ? Theme.LIGHT : Theme.DARK
    );
  }

  private getInitialTheme(): Theme {
    const storedTheme = this.localStorage.getItem(THEME_STORAGE_KEY);
    return this.isValidTheme(storedTheme) ? (storedTheme as Theme) : Theme.DARK;
  }

  private isValidTheme(theme: string | null): boolean {
    return theme === Theme.DARK || theme === Theme.LIGHT;
  }

  private applyTheme(theme: Theme): void {
    // Update data-theme attribute
    this.#htmlElement.setAttribute('data-theme', theme);

    // Update class for CSS styling
    this.#htmlElement.classList.remove(theme === Theme.DARK ? 'light' : 'dark');
    this.#htmlElement.classList.add(theme === Theme.DARK ? 'dark' : 'light');

    // Save to local storage
    this.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}
