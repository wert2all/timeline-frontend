import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { applicationFeature } from '../store/application/application.reducers';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly canSave = inject(Store).selectSignal(
    applicationFeature.canUseNecessaryCookies
  );
  //
  // Set a value in local storage
  setItem(key: string, value: string): void {
    if (this.canSave()) {
      localStorage.setItem(key, value);
    }
  }

  // Get a value from local storage
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  // Remove a value from local storage
  removeItem(key: string): void {
    if (this.canSave()) {
      localStorage.removeItem(key);
    }
  }

  // Clear all items from local storage
  clear(): void {
    if (this.canSave()) {
      localStorage.clear();
    }
  }
}
