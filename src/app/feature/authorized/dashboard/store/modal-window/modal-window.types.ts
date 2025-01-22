import { Loadable, Undefined } from '../../../../../app.types';

export enum ModalWindowType {
  FEATURES = 'features',
  SETTINGS = 'settings',
}
export type ModalWindowState = Loadable & {
  windowType: ModalWindowType | Undefined;
};
