import { createFeature, createReducer } from '@ngrx/store';
import { DashboardOperationsState } from './operations.types';

const initState: DashboardOperationsState = {
  loading: false,
  operations: [],
};

export const dashboardOperationsFeature = createFeature({
  name: 'dashboard operation',
  reducer: createReducer(initState),
});
