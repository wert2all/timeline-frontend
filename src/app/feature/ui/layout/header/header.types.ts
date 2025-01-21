import { Unique } from '../../../../app.types';

export interface CurrentAccountView {
  name: string;
  firstLetter: string;
  avatar?: string;
}

export type AccountView = Unique & CurrentAccountView;
