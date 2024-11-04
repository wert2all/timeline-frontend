import { effect, Injectable, signal, WritableSignal } from '@angular/core';

export const storageKey = 'theme';
enum Themes {
  gruvbox = 'gruvbox',
  bumblebee = 'bumblebee',
}
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly #htmlElement = document.getElementById('html') as HTMLHtmlElement;
  private readonly themeSignal: WritableSignal<Themes> = signal<Themes>(
    Themes.gruvbox
  );

  constructor() {
    this.initializeThemeFromPreferences();

    effect(() => {
      this.updateRenderedTheme();
    });
  }

  toggleTheme(): void {
    this.themeSignal.update(prev =>
      prev === Themes.gruvbox ? Themes.bumblebee : Themes.gruvbox
    );
  }

  isDark() {
    return this.themeSignal() === Themes.gruvbox;
  }

  private initializeThemeFromPreferences() {
    const storedTheme = localStorage.getItem(storageKey);

    if (storedTheme) {
      this.themeSignal.update(() => this.themeFrom(storedTheme));
    }
  }

  private themeFrom(theme: string): Themes {
    switch (theme) {
      case Themes.gruvbox:
        return Themes.gruvbox;
      case Themes.bumblebee:
        return Themes.bumblebee;
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
    localStorage.setItem(storageKey, this.themeSignal());
  }
}
