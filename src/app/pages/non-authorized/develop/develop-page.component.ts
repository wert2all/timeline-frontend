import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
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

import { TableOfContentsContainerComponent } from '../../../feature/table-of-contents/components/table-of-contents-container/table-of-contents-container.component';
import { TableOfContents } from '../../../feature/table-of-contents/components/table-of-contents/table-of-contents.types';

import { TimelineComponent } from '../../../feature/timeline/timeline.component';
import {
  ExistViewTimelineEvent,
  ViewEventImage,
} from '../../../store/timeline/timeline.types';

import { Store } from '@ngrx/store';
import { Status } from '../../../app.types';
import { EditEventFormComponent } from '../../../feature/edit-event/edit-event-form/edit-event-form.component';
import { LoaderComponent } from '../../../share/loader/loader.component';
import { TableOfContentsActions } from '../../../store/table-of-contents/table-of-contents.actions';
import { DevelopContentComponent } from './components/develop-content/develop-content.component';

@Component({
  selector: 'app-develop-page',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    TitleComponent,
    EditEventFormComponent,
    TimelineComponent,
    DevelopContentComponent,
    TableOfContentsContainerComponent,
    LoaderComponent,
  ],
  templateUrl: './develop-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopPageComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly dumpEventImage: ViewEventImage = {
    imageId: 1,
    title: dumpTitle,
    status: Status.SUCCESS,
    previewUrl: 'https://picsum.photos/500/300',
    url: 'https://picsum.photos/800/600',
  };
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
    tags: [dumpTag, { ...dumpTag, title: '#dump tag changed' }],
    image: this.dumpEventImage,
  };

  dumpAddEvent = signal(this.dumpEvent);
  dumpTimelineEvents: WritableSignal<ExistViewTimelineEvent[]> = signal([
    this.dumpEvent,
    { ...this.dumpEvent, loading: true, changeDirection: true, image: null },
  ]);

  protected readonly tableOfContent = signal<TableOfContents>({
    items: [
      {
        title: 'Layout',
        uuid: 'LayoutTesting',
        link: '/develop#LayoutTesting',
      },
      {
        title: 'Timeline',
        uuid: 'TimelineComponent',
        link: '/develop#TimelineComponent',
      },
      {
        title: 'Edit Event Form ',
        uuid: 'EditEventFormComponent',
        link: '/develop#EditEventFormComponent',
      },
      {
        title: 'Loader',
        uuid: 'LoaderComponent',
        link: '/develop#LoaderComponent',
      },
    ],
  });

  ngOnInit(): void {
    this.store.dispatch(
      TableOfContentsActions.setTableOfContents(this.tableOfContent())
    );
  }
}
