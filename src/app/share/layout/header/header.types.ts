import { Unique } from '../../../app.types';

export type CurrentAccountView = {
  name: string;
  firstLetter: string;
  avatar?: string;
};

export type AccountView = Unique & CurrentAccountView;
