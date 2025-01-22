import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { sharedFeature } from '../store/shared.reducers';

@Injectable({
  providedIn: 'root',
})
export class SharedLocalStorageService {
  private readonly canSave = inject(Store).selectSignal(
    sharedFeature.canUseNecessaryCookies
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
