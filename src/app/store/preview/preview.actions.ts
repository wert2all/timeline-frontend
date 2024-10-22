import { createActionGroup, props } from '@ngrx/store';
import { DataWrapper } from '../../app.types';
import { PreviewItem } from './preview.types';

export const PreviewActions = createActionGroup({
  source: 'Preview',
  events: {
    'Add URL': props<{ url: URL }>(),
    'Success adding URL': props<{
      url: string;
      preview: DataWrapper<PreviewItem>;
    }>(),
  },
});
