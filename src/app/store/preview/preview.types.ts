import { DataWrapper } from '../../app.types';

export type PreviewItem = {
  image: string;
  title?: string;
};

export type PreviewHolder = {
  url: string;
  updateAttemps: number;
  data: DataWrapper<PreviewItem>;
};

export type PreviewState = {
  previews: PreviewHolder[];
};
