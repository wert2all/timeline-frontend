import { DataWrapper } from '../../app.types';

export type PreviewItem = {
  image: string;
};

export type PreviewHolder = {
  url: string;
  data: DataWrapper<PreviewItem>;
};

export type PreviewState = {
  previews: PreviewHolder[];
};
