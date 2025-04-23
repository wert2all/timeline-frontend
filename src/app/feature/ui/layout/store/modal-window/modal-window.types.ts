import { Loadable, Undefined } from '../../../../../app.types';

export enum ModalWindowType {
  FEATURES = 'features',
  SETTINGS = 'settings',
  ADD_ACCOUNT = 'add_account',
  ADD_TIMELINE = 'add_timeline',
}
export type ModalWindowState = Loadable & {
  windowType: ModalWindowType | Undefined;
};
