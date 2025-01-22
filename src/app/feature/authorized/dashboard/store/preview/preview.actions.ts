import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DataWrapper } from '../../../../../app.types';
import { PreviewItem, PreviewPollingActionsProps } from './preview.types';

export const PreviewActions = createActionGroup({
  source: 'Preview',
  events: {
    'Add URL': props<{ url: URL }>(),
    'Success adding URL': props<{
      url: string;
      preview: DataWrapper<PreviewItem>;
    }>(),

    'Start polling previews': props<PreviewPollingActionsProps>(),
    'Stop polling previews': emptyProps(),
    'Continue polling previews': props<PreviewPollingActionsProps>(),

    'Success update previews': props<{
      previews: {
        url: string;
        preview: DataWrapper<PreviewItem>;
      }[];
    }>(),

    'Update previews': props<PreviewPollingActionsProps>(),
  },
});
