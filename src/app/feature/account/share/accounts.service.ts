import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiClient } from '../../../api/internal/graphql';
import { apiAssertNotNull, extractApiData } from '../../../libs/api.functions';
import { Account } from '../account.types';

@Injectable({ providedIn: 'root' })
export class AccountsService {
  private readonly api = inject(ApiClient);

  getAccounts(): Observable<Account[]> {
    return this.api.authorize().pipe(
      map(result =>
        apiAssertNotNull(
          extractApiData(result)?.profile?.accounts,
          'Could not authorize'
        )
      ),
      map(shortAccounts => {
        return shortAccounts
          .filter(account => !!account)
          .map(account => ({
            id: account.id,
            name: account.name ? account.name : undefined,
            about: account.about ? account.about : undefined,
            previewlyToken: account.previewlyToken,
            avatar: { id: account.avatarId },
            settings: account.settings.reduce(
              (acc, v) => ({ ...acc, [v.key]: v.value }),
              {}
            ),
          }));
      })
    );
  }
}
