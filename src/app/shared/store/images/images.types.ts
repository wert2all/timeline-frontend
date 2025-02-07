import {
  Iterable,
  MaybeWithError,
  StatusWithPending,
  Undefined,
  Unique,
  UniqueType,
  WithPandingStatus,
} from '../../../app.types';

export interface ImageData {
  resized_490x250: string;
}

export type UploadedImage = Iterable & {
  status: StatusWithPending;
  data: null | ImageData;
  error: string | Undefined;
};
export type UploadQuequeImage = Unique &
  MaybeWithError &
  WithPandingStatus & { id?: number };

export interface ImagesState {
  queue: Record<UniqueType, UploadQuequeImage>;
  images: Record<number, UploadedImage>;
  shouldDelete: Iterable[];
}
