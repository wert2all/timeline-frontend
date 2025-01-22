import { DataWrapper } from '../../../../../app.types';

export interface PreviewPollingActionsProps {
  urls: URL[];
}

export interface PreviewItem {
  image: string;
  title?: string;
}

export interface PreviewHolder {
  url: string;
  updateAttempts: number;
  data: DataWrapper<PreviewItem>;
}

export interface PreviewState {
  previews: PreviewHolder[];
}
