import { Signal } from '@angular/core';
import { Undefined } from '../../app.types';

export interface TokenProvider {
  getToken(): string | Undefined;
}

export interface AuthProcess {
  onAuth: Signal<boolean>;
  login(): void;
  logout(): void;
}
