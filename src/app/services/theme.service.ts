import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

export const storageKey = 'theme';
enum Themes {
  gruvbox = 'gruvbox',
  pastel = 'pastel',
}
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly localStorage = inject(LocalStorageService);
  private readonly themeSignal = signal<Themes>(Themes.gruvbox);

  readonly #htmlElement = document.getElementById('html') as HTMLHtmlElement;
  isDark = computed(() => {
    return this.themeSignal() === Themes.gruvbox;
  });

  constructor() {
    this.initializeThemeFromPreferences();

    effect(() => {
      this.updateRenderedTheme();
    });
  }

  toggleTheme(): void {
    this.themeSignal.update(prev =>
      prev === Themes.gruvbox ? Themes.pastel : Themes.gruvbox
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
      case Themes.gruvbox:
        return Themes.gruvbox;
      case Themes.pastel:
        return Themes.pastel;
      default:
        return Themes.gruvbox;
    }
  }

  private updateRenderedTheme(): void {
    if (
      this.#htmlElement.attributes.getNamedItem('data-theme')?.value !==
      this.themeSignal()
    ) {
      this.#htmlElement.classList.remove(this.isDark() ? 'light' : 'dark');
      this.#htmlElement.classList.add(this.isDark() ? 'dark' : 'light');

      this.#htmlElement.setAttribute('data-theme', this.themeSignal());
    }
    this.localStorage.setItem(storageKey, this.themeSignal());
  }
}
