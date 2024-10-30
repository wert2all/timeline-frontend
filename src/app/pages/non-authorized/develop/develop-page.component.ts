import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  WritableSignal,
} from '@angular/core';
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
import { HeroComponent } from '../../../share/hero/hero.component';
import { TitleComponent } from '../../../share/layout/content/title/title.component';
import { LayoutComponent } from '../../../share/layout/layout.component';
import { MarkdownContentComponent } from '../../../share/markdown-content/markdown-content.component';

import { TableOfContentsContainerComponent } from '../../../feature/table-of-contents/components/table-of-contents-container/table-of-contents-container.component';
import { TableOfContentsComponent } from '../../../feature/table-of-contents/components/table-of-contents/table-of-contents.component';
import { TableOfContents } from '../../../feature/table-of-contents/components/table-of-contents/table-of-contents.types';
import { TimelineEventMenuComponent } from '../../../share/timeline/timeline/event/menu/menu.component';
import { TimelineComponent } from '../../../share/timeline/timeline/timeline.component';
import { PreviewHolder } from '../../../store/preview/preview.types';
import { ExistViewTimelineEvent } from '../../../store/timeline/timeline.types';

import { EditEventFormComponent } from '../../../feature/edit-event/edit-event-form/edit-event-form.component';
import { LinkPreviewComponent } from '../../../feature/edit-event/edit-event-form/link-preview/link-preview.component';
import { DevelopContentComponent } from './components/develop-content/develop-content.component';

@Component({
  selector: 'app-develop-page',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    TitleComponent,
    LinkPreviewComponent,
    EditEventFormComponent,
    TimelineEventMenuComponent,
    MarkdownContentComponent,
    TimelineComponent,
    TableOfContentsComponent,
    HeroComponent,
    DevelopContentComponent,
    TableOfContentsContainerComponent,
  ],
  templateUrl: './develop-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopPageComponent {
  private readonly dumpEvent: ExistViewTimelineEvent = {
    ...dumpEvent,
    id: 0,
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
  };

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
  dumpTimelineEvents: WritableSignal<ExistViewTimelineEvent[]> = signal([
    this.dumpEvent,
    { ...this.dumpEvent, loading: true, changeDirection: true },
  ]);

  protected readonly tableOfContent = signal<TableOfContents>({
    items: [
      {
        title: 'Layout',
        uuid: 'LayoutTesting',
      },
      {
        title: 'Timeline',
        uuid: 'TimelineComponent',
      },
      {
        title: 'Markdown',
        uuid: 'MarkdownContentComponent',
      },
      {
        title: 'Link Preview',
        uuid: 'LinkPreviewComponent',
      },
      {
        title: 'Edit Event Form ',
        uuid: 'EditEventFormComponent',
      },
      {
        title: 'Event Menu',
        uuid: 'TimelineEventMenuComponent',
      },
    ],
  });
}
