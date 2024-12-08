import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
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
import { ExistViewTimelineEvent } from '../../../store/timeline/timeline.types';

import { Store } from '@ngrx/store';
import { EditEventFormComponent } from '../../../feature/edit-event/edit-event-form/edit-event-form.component';
import { ThemeSwitchComponent } from '../../../feature/ui/theme/theme-switch.component';
import { TopMenuComponent } from '../../../feature/user/top-menu/top-menu.component';
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
    ThemeSwitchComponent,
    TopMenuComponent,
  ],
  templateUrl: './develop-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopPageComponent implements OnInit {
  private readonly store = inject(Store);
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

  dumpAddEvent = signal(this.dumpEvent);
  dumpTimelineEvents: WritableSignal<ExistViewTimelineEvent[]> = signal([
    this.dumpEvent,
    { ...this.dumpEvent, loading: true, changeDirection: true },
  ]);

  protected readonly currentAccountWithAvatar = {
    id: 1,
    name: 'John Doe',
    firstLetter: 'J',
    previewlyToken: 'token',
    settings: {},
    avatar:
      'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
  };

  protected readonly currentAccountWithoutAvatar = {
    id: 2,
    name: 'John Doe',
    firstLetter: 'J',
    previewlyToken: 'token',
    settings: {},
  };

  protected readonly userAccounts = [
    this.currentAccountWithAvatar,
    this.currentAccountWithoutAvatar,
  ];

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
        title: 'Top menu',
        uuid: 'TopMenuComponent',
        link: '/develop#TopMenuComponent',
      },
    ],
  });

  ngOnInit(): void {
    this.store.dispatch(
      TableOfContentsActions.setTableOfContents(this.tableOfContent())
    );
  }
}
