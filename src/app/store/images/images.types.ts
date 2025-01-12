import {
  Iterable,
  StatusWithPending,
  Undefined,
  Unique,
  UniqueType,
  WithError,
  WithPandingStatus,
} from '../../app.types';

export type ImageData = {
  resized_490x250: string;
};

export type UploadedImage = Iterable & {
  status: StatusWithPending;
  data: null | ImageData;
  error: string | Undefined;
};
export type UploadQuequeImage = Unique &
  WithError &
  WithPandingStatus & { id?: number };

export type ImagesState = {
  queue: Record<UniqueType, UploadQuequeImage>;
  images: Record<number, UploadedImage>;
  maybeShouldRemoveImages: number[];
};
