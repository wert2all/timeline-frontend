import { ShortAccount } from '../../api/internal/graphql';
import { Iterable, Undefined } from '../../app.types';
import { AccountFeaturesSettings } from '../../shared/services/features.service';
import { Account, AccountView } from './account.types';

export const toFeaturesSettings = (
  account: Account | Undefined
): AccountFeaturesSettings => {
  const settings: Record<string, string | boolean> = {};
  if (account) {
    Object.entries(account.settings).forEach(([key, value]) => {
      if (value === 'true' || value === 'false') {
        settings[key] = value === 'true';
      } else {
        settings[key] = value;
      }
    });
  }
  return settings;
};

export const toAccountView = (
  account: Undefined | (Iterable & { name?: string | Undefined })
): AccountView | null =>
  account
    ? {
        uuid: account.id.toString(),
        name: account.name || 'John Doe',
        firstLetter: account.name?.charAt(0).toUpperCase() || 'J',
      }
    : null;

export const toAccount = (account: ShortAccount): Account => {
  return {
    id: account.id,
    name: account.name || undefined,
    previewlyToken: account.previewlyToken,
    avatar: { id: account.avatarId },
    settings: account.settings.reduce(
      (acc, setting) => ({
        ...acc,
        [setting.key]: setting.value,
      }),
      {}
    ),
  };
};
