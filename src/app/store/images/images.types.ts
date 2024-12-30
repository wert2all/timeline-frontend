import {
  Iterable,
  Loadable,
  StatusWithPending,
  Undefined,
} from '../../app.types';

export type ImageData = {
  resized_490x250: string;
};

export type UploadedImage = Iterable & {
  status: StatusWithPending;
  data: null | ImageData;
  error: string | Undefined;
};

export type CurrentUpload = Loadable & {
  error: Undefined | string;
  previewUrl: Undefined | string;
};

export type ImagesState = {
  currentUpload: CurrentUpload;
  images: Record<number, UploadedImage>;
};
