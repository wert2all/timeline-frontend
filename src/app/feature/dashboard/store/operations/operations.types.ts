import { Loadable } from '../../../../app.types';

export interface Operation {
  name: string;
}
export type DashboardOperationsState = Loadable & {
  operations: Operation[];
};
