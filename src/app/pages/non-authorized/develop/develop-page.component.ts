import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Status } from '../../../app.types';
import {
  dumpEvent,
  dumpLink,
  dumpLinkTitle,
  dumpTags,
} from '../../../share/dump.types';
import { TitleComponent } from '../../../share/layout/content/title/title.component';
import { LayoutComponent } from '../../../share/layout/layout.component';
import { EventAdditionalContentComponent } from '../../../share/timeline/timeline/event/content/additional/additional-content.component';
import { PreviewHolder } from '../../../store/preview/preview.types';
import { EditEventFormComponent } from '../../../widgets/timeline-container/edit-event-form/edit-event-form.component';
import { LinkPreviewComponent } from '../../../widgets/timeline-container/edit-event-form/link-preview/link-preview.component';
import {
  EditableTimelineTypes,
  EditableViewTimelineEvent,
} from '../../../widgets/timeline-container/timeline.types';

@Component({
  selector: 'app-develop-page',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    TitleComponent,
    LinkPreviewComponent,
    EditEventFormComponent,
    EventAdditionalContentComponent,
  ],
  templateUrl: './develop-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopPageComponent {
  dumpLink = signal(new URL(dumpLink));

  dumpPreviewWithError = signal<PreviewHolder>({
    url: dumpLink,
    updateAttemps: 0,
    data: { status: Status.ERROR, error: new Error('some error') },
  });

  dumpPreviewLoading = signal<PreviewHolder>({
    url: dumpLink,
    updateAttemps: 0,
    data: { status: Status.LOADING },
  });

  dumpPreview = signal<PreviewHolder>({
    url: dumpLink,
    updateAttemps: 0,
    data: {
      status: Status.SUCCESS,
      data: {
        image: 'https://img.previewly.top/screenshots/httpswww.thum.io.jpeg',
        title: 'Thum.io | Fast real-time website screenshot API',
      },
    },
  });

  dumpAddEvent = signal<
    EditableViewTimelineEvent & {
      eventLength: string;
      shouldAccentLine: boolean;
    }
  >({
    ...dumpEvent,
    url: {
      title: dumpLinkTitle,
      link: dumpLink,
    },
    date: {
      date: '2024-05-26T15:21:00.000+03:00',
      relative: '2 days ago',
    },
    changeDirection: false,
    tags: dumpTags,
    description: 'Some description',
    type: EditableTimelineTypes.draft,
    eventLength: 'mb-8',
    shouldAccentLine: true,
  });
}
