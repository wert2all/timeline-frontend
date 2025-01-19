import { Loadable, Undefined } from '../../app.types';

export enum CookieCategory {
  NECESSARY = 'necessary',
  ANALYTICS = 'analytics',
}

export enum ModalWindowType {
  FEATURES = 'features',
  SETTINGS = 'settings',
}
export type ApplicationState = Loadable & {
  cookie: CookieCategory[];
  windowType: ModalWindowType | Undefined;
};
