import { Injectable, inject } from '@angular/core';
import { Undefined } from '../../../app.types';
import { SharedLocalStorageService } from '../../../shared/services/local-storage.service';
import { isAccount } from '../account.functions';
import { Account, AccountSettings } from '../account.types';

const ACCOUNTS_CACHE_KEY = 'account_cache';

@Injectable({ providedIn: 'root' })
export class CachedAccountsProvider {
  private readonly localStorage = inject(SharedLocalStorageService);
  private cache: Record<number, Account> = {};

  constructor() {
    this.initCache();
  }

  getAccounts(): Account[] {
    return Object.values(this.cache);
  }

  getAccount(accountId: number): Account | Undefined {
    return this.cache[accountId];
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

  setAccounts(accounts: Account[]) {
    this.cache = {};
    accounts.forEach(account => {
      this.cache[account.id] = account;
    });
    this.saveCache();
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
            .map((maybeAccount): Account | null => {
              if (isAccount(maybeAccount)) {
                const id = Number(maybeAccount.id);
                if (isFinite(id)) {
                  return {
                    id: maybeAccount.id,
                    name: maybeAccount.name,
                    about: maybeAccount.about,
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
