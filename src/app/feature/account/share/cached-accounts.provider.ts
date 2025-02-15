import { Injectable, inject } from '@angular/core';
import { Undefined } from '../../../app.types';
import { SharedLocalStorageService } from '../../../shared/services/local-storage.service';
import { Account, AccountSettings } from '../account.types';

const ACCOUNTS_CACHE_KEY = 'account_cache';
export type CachedAccount = Omit<Account, 'avatar'> & {
  avatarId: number | Undefined;
};

@Injectable({ providedIn: 'root' })
export class CachedAccountsProvider {
  private readonly localStorage = inject(SharedLocalStorageService);
  private cache: Record<number, CachedAccount> = {};

  constructor() {
    this.initCache();
  }

  getAccounts(): Account[] {
    return Object.values(this.cache).map(account =>
      this.convertToAccount(account)
    );
  }

  getAccount(accountId: number): Account | Undefined {
    return this.cache[accountId]
      ? this.convertToAccount(this.cache[accountId])
      : undefined;
  }

  upsetAccount(account: Account) {
    this.cache[account.id] = this.convertToCachedAccount(account);
    this.saveCache();
  }

  updateAccountSettings(accountId: number, settings: AccountSettings) {
    if (this.cache[accountId]) {
      const account = {
        ...this.cache[accountId],
        avatar: { id: this.cache[accountId].id },
        settings: settings,
      };
      this.upsetAccount(account);
    }
  }

  setAccounts(accounts: Account[]) {
    this.cache = {};
    accounts.forEach(account => {
      this.cache[account.id] = this.convertToCachedAccount(account);
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
            .map((maybeAccount): CachedAccount | null => {
              if (this.isAccount(maybeAccount)) {
                const id = Number(maybeAccount.id);
                if (isFinite(id)) {
                  return {
                    id: maybeAccount.id,
                    name: maybeAccount.name,
                    about: maybeAccount.about,
                    avatarId: maybeAccount.avatarId,
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

  private convertToRecord(accounts: CachedAccount[]) {
    return accounts.reduce(
      (acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      },
      {} as Record<number, CachedAccount>
    );
  }

  private convertToAccount(account: CachedAccount): Account {
    return {
      id: account.id,
      name: account.name,
      about: account.about,
      previewlyToken: account.previewlyToken,
      avatar: { id: account.avatarId },
      settings: account.settings,
    };
  }
  private convertToCachedAccount(account: Account): CachedAccount {
    return {
      id: account.id,
      name: account.name,
      about: account.about,
      previewlyToken: account.previewlyToken,
      avatarId: account.avatar.id,
      settings: account.settings,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isAccount(maybeAccount: any): maybeAccount is CachedAccount {
    return (
      'id' in maybeAccount &&
      'previewlyToken' in maybeAccount &&
      'settings' in maybeAccount &&
      'avatarId' in maybeAccount
    );
  }
}
