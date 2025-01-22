import { Unique } from '../../../app.types';

export type Tabs = Unique & {
  title: string;
  icon: string;
  isEnabled: boolean;
};
