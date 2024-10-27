import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Status } from '../../../app.types';
import { createViewDatetime } from '../../../libs/view/date.functions';
import {
  dumpContent,
  dumpEvent,
  dumpLink,
  dumpLinkTitle,
  dumpTag,
  dumpTitle,
} from '../../../share/dump.types';
import { TitleComponent } from '../../../share/layout/content/title/title.component';
import { LayoutComponent } from '../../../share/layout/layout.component';
import { MarkdownContentComponent } from '../../../share/markdown-content/markdown-content.component';
import { EventAdditionalContentComponent } from '../../../share/timeline/timeline/event/content/additional/additional-content.component';
import { TimelineEventMenuComponent } from '../../../share/timeline/timeline/event/menu/menu.component';
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
    TimelineEventMenuComponent,
    MarkdownContentComponent,
  ],
  templateUrl: './develop-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopPageComponent {
  private readonly dumpEvent: EditableViewTimelineEvent & {
    eventLength: string;
    shouldAccentLine: boolean;
  } = {
    ...dumpEvent,
    id: 1,
    url: {
      title: dumpLinkTitle,
      link: dumpLink,
    },
    date: createViewDatetime(dumpEvent.date, true),
    title: dumpTitle,
    description: dumpContent,
    showTime: true,
    changeDirection: false,
    tags: [dumpTag, { ...dumpTag, title: '#dump tag changed' }],
    type: EditableTimelineTypes.draft,
    eventLength: 'mb-8',
    shouldAccentLine: true,
    isEditableType: true,
  };
  dumpLink = signal(new URL(dumpLink));

  dumpPreviewWithError = signal<PreviewHolder>({
    url: dumpLink,
    updateAttempts: 0,
    data: { status: Status.ERROR, error: new Error('some error') },
  });

  dumpContent = signal(dumpContent);
  dumpPreviewLoading = signal<PreviewHolder>({
    url: dumpLink,
    updateAttempts: 0,
    data: { status: Status.LOADING },
  });

  dumpPreview = signal<PreviewHolder>({
    url: dumpLink,
    updateAttempts: 0,
    data: {
      status: Status.SUCCESS,
      data: {
        image: 'https://img.previewly.top/screenshots/httpswww.thum.io.jpeg',
        title: 'Thum.io | Fast real-time website screenshot API',
      },
    },
  });

  dumpAddEvent = signal(this.dumpEvent);
}
