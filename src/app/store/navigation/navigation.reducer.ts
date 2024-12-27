import { createFeature, createReducer } from '@ngrx/store';

const initialState = {};

export const navigationFeature = createFeature({
  name: 'navigation',
  reducer: createReducer(initialState),
});
