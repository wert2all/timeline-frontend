import { Injectable, inject } from '@angular/core';
import { Iterable, Undefined } from '../../app.types';
import { SharedLocalStorageService } from '../../shared/services/local-storage.service';

const ACCOUNT_ID_KEY = 'account_id';
@Injectable({ providedIn: 'root' })
export class CurrentAccountProvider {
  private readonly storage = inject(SharedLocalStorageService);

  getActiveAccountId(): number | Undefined {
    const storageValue = this.storage.getItem(ACCOUNT_ID_KEY);
    if (storageValue) {
      return isFinite(Number(storageValue)) ? Number(storageValue) : null;
    } else {
      return null;
    }
  }

  setActiveAccountId(currentAccount: Iterable) {
    this.storage.setItem(ACCOUNT_ID_KEY, String(currentAccount.id));
  }
}
