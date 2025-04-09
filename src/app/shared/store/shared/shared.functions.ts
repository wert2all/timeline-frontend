import { Store, createSelector } from '@ngrx/store';
import { sharedFeature } from './shared.reducers';

export const filterLoadedImage = (imageId: number, store: Store) =>
  store.selectSignal(
    createSelector(sharedFeature.selectLoadedImages, images =>
      images.find(image => image.id === imageId)
    )
  )();
