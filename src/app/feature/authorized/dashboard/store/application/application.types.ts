import { Loadable, Undefined } from '../../../../../app.types';

export enum ModalWindowType {
  FEATURES = 'features',
  SETTINGS = 'settings',
}
export type ApplicationState = Loadable & {
  windowType: ModalWindowType | Undefined;
};
