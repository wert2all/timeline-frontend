import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { ApiClient } from '../../../../api/internal/graphql';
import {
  apiAssertNotNull,
  extractApiData,
} from '../../../../libs/api.functions';

import { Iterable, Undefined } from '../../../../app.types';
import { SharedLocalStorageService } from '../../../../shared/services/local-storage.service';
import { Account } from '../../../authorized/account/account.types';

const ACTIVE_ACCOUNT_KEY = 'active-account';

@Injectable({ providedIn: 'root' })
export class CurrentAccountService {
  private readonly localStorage = inject(SharedLocalStorageService);
  private readonly api = inject(ApiClient);

  getAccount(): Observable<Account | Undefined> {
    return this.api.authorize().pipe(
      map(result =>
        apiAssertNotNull(
          extractApiData(result)?.profile?.accounts,
          'Could not authorize'
        )
      ),
      map(accounts => {
        const currentAccountId = this.getAccountIdFromStorage();
        const currentAccount = accounts.find(
          account => account?.id === currentAccountId
        );
        const firstAccount = accounts.slice(0, 1)[0];
        return currentAccount || firstAccount;
      }),
      tap(account => this.saveAccountToStorage(account)),
      map(account =>
        account
          ? {
              id: account.id,
              name: account.name || undefined,
              previewlyToken: account.previewlyToken,
              settings: account.settings.reduce(
                (prev, cur) => ({
                  ...prev,
                  [cur.key]: cur.value,
                }),
                {}
              ),
            }
          : null
      )
    );
  }

  private saveAccountToStorage(account: Iterable | null): void {
    if (account) {
      this.localStorage.setItem(ACTIVE_ACCOUNT_KEY, account.id.toString());
    } else {
      this.localStorage.clear();
    }
  }

  private getAccountIdFromStorage(): number | Undefined {
    const accountId = Number(this.localStorage.getItem(ACTIVE_ACCOUNT_KEY));
    return isFinite(accountId) ? accountId : undefined;
  }
}
