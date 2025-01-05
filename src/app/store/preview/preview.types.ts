import { DataWrapper } from '../../app.types';

export type PreviewPollingActionsProps = { urls: URL[] };

export type PreviewItem = {
  image: string;
  title?: string;
};

export type PreviewHolder = {
  url: string;
  updateAttempts: number;
  data: DataWrapper<PreviewItem>;
};

export type PreviewState = {
  previews: PreviewHolder[];
};
