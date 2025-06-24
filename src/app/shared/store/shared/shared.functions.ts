import { createSelector, Store } from '@ngrx/store';
import { sharedFeature } from './shared.reducers';

export const selectLoadedImage = (imageId: number, store: Store) =>
  store.selectSignal(
    createSelector(sharedFeature.selectLoadedImages, images =>
      images.find(image => image.id === imageId)
    )
  )();
