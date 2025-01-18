import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

export const storageKey = 'theme';
enum Themes {
  dark = 'gruvbox',
  light = 'pastel',
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly localStorage = inject(LocalStorageService);
  private readonly themeSignal = signal<Themes>(Themes.dark);

  readonly #htmlElement = document.getElementById('html') as HTMLHtmlElement;
  isDark = computed(() => {
    return this.themeSignal() === Themes.dark;
  });

  constructor() {
    this.initializeThemeFromPreferences();

    effect(() => {
      if (
        this.#htmlElement.attributes.getNamedItem('data-theme')?.value !==
        this.themeSignal()
      ) {
        this.#htmlElement.classList.remove(this.isDark() ? 'light' : 'dark');
        this.#htmlElement.classList.add(this.isDark() ? 'dark' : 'light');

        this.#htmlElement.setAttribute('data-theme', this.themeSignal());
      }
      this.localStorage.setItem(storageKey, this.themeSignal());
    });
  }

  toggleTheme(): void {
    this.themeSignal.update(prev =>
      prev === Themes.dark ? Themes.light : Themes.dark
    );
  }

  private initializeThemeFromPreferences() {
    const storedTheme = this.localStorage.getItem(storageKey);

    if (storedTheme) {
      this.themeSignal.update(() => this.themeFrom(storedTheme));
    }
  }

  private themeFrom(theme: string): Themes {
    switch (theme) {
      case Themes.dark:
        return Themes.dark;
      case Themes.light:
        return Themes.light;
      default:
        return Themes.dark;
    }
  }
}
