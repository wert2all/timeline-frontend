import { Undefined } from '../../app.types';
import { AccountFeaturesSettings } from '../../shared/services/features.service';
import { Account } from './account.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isAccount = (maybeAccount: any): maybeAccount is Account => {
  return (
    'id' in maybeAccount &&
    'previewlyToken' in maybeAccount &&
    'settings' in maybeAccount
  );
};

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
