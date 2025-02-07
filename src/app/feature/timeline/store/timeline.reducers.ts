import { createFeature, createReducer } from '@ngrx/store';
import { NewTimelineState } from './timeline.types';

const initialState: NewTimelineState = {
  loading: false,
  events: [],
  error: null,
};
export const timelineFeature = createFeature({
  name: 'new-timeline',
  reducer: createReducer(initialState),
});
