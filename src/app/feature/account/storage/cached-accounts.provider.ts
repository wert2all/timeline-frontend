import { Injectable, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Undefined } from '../../../app.types';
import { SharedLocalStorageService } from '../../../shared/services/local-storage.service';
import { isAccount } from '../account.functions';
import {
  Account,
  AccountSettings,
  AccountsProvigerInterface,
} from '../account.types';
import { AccountsProvider } from './accounts.provider';

const ACCOUNTS_CACHE_KEY = 'account_cache';

@Injectable({ providedIn: 'root' })
export class CachedAccountsProvider implements AccountsProvigerInterface {
  private readonly localStorage = inject(SharedLocalStorageService);
  private readonly provider = inject(AccountsProvider);
  private cache: Record<number, Account> = {};

  constructor() {
    this.initCache();
  }

  getAccounts(): Observable<Account[]> {
    if (Object.keys(this.cache).length > 0) {
      return of(Object.values(this.cache));
    }
    return this.provider.getAccounts().pipe(
      tap(accounts => {
        this.cache = this.convertToRecord(accounts);
        this.saveCache();
      })
    );
  }

  getAccount(accountId: number): Observable<Account | Undefined> {
    const account = this.cache[accountId];
    if (account) {
      return of(account);
    }
    return this.provider.getAccount(accountId);
  }

  upsetAccount(account: Account) {
    this.cache[account.id] = account;
    this.saveCache();
  }

  updateAccountSettings(accountId: number, settings: AccountSettings) {
    if (this.cache[accountId]) {
      const account = {
        ...this.cache[accountId],
        settings: settings,
      };
      this.upsetAccount(account);
    }
  }

  private saveCache() {
    this.localStorage.setItem(ACCOUNTS_CACHE_KEY, JSON.stringify(this.cache));
  }

  private initCache() {
    const accountCache = this.localStorage.getItem(ACCOUNTS_CACHE_KEY);
    if (accountCache) {
      const cachedValues = JSON.parse(accountCache);
      if (cachedValues) {
        this.cache = this.convertToRecord(
          Object.values(cachedValues)
            .map(maybeAccount => {
              if (isAccount(maybeAccount)) {
                const id = Number(maybeAccount.id);
                if (isFinite(id)) {
                  return {
                    id: maybeAccount.id,
                    name: maybeAccount.name,
                    previewlyToken: maybeAccount.previewlyToken,
                    settings: maybeAccount.settings,
                  };
                }
              }
              return null;
            })
            .filter(account => !!account)
        );
      }
    }
  }

  private convertToRecord(accounts: Account[]): Record<number, Account> {
    return accounts.reduce(
      (acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      },
      {} as Record<number, Account>
    );
  }
}
