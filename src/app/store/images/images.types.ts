import {
  Iterable,
  Loadable,
  StatusWithPending,
  Undefined,
} from '../../app.types';

export type UploadedImage = Iterable & {
  status: StatusWithPending;
  data: null;
  error: string | Undefined;
};

export type CurrentUpload = Loadable & {
  error: Undefined | string;
  previewUrl: Undefined | string;
};

export type UploadState = {
  currentUpload: CurrentUpload;
  images: UploadedImage[];
};
