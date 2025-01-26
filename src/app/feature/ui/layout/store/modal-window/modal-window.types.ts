import { Loadable, Undefined } from '../../../../../app.types';

export enum ModalWindowType {
  FEATURES = 'features',
  SETTINGS = 'settings',
  ADD_ACCOUNT = 'add_account',
}
export type ModalWindowState = Loadable & {
  windowType: ModalWindowType | Undefined;
};
