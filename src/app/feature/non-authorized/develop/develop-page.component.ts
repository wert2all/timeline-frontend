import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { TitleComponent } from '../../../shared/content/title/title.component';
import { LayoutComponent } from '../../../shared/layout/layout.component';

import { TableOfContentsContainerComponent } from '../../ui/table-of-contents/components/table-of-contents-container/table-of-contents-container.component';
import { TableOfContents } from '../../ui/table-of-contents/components/table-of-contents/table-of-contents.types';

import { Store } from '@ngrx/store';
import { SharedLoaderComponent } from '../../../shared/content/loader/loader.component';
import { AccountView } from '../../account/account.types';
import { SharedAccountViewComponent } from '../../account/share/view/account-view.component';
import { TopDashboardButtonComponent } from '../../dashboard/add-event-button/top-dashboard-button.component';
import { MarkdownHelpComponent } from '../../static-content/share/markdown-help/markdown-help.component';
import { SharedTimelineComponent } from '../../timeline/share/timeline/timeline.component';
import { TableOfContentsActions } from '../../ui/table-of-contents/store/table-of-contents/table-of-contents.actions';
import { DevelopContentComponent } from './components/develop-content/develop-content.component';

@Component({
  standalone: true,
  imports: [
    LayoutComponent,
    TitleComponent,
    DevelopContentComponent,
    TableOfContentsContainerComponent,
    SharedLoaderComponent,
    MarkdownHelpComponent,
    SharedTimelineComponent,
    SharedAccountViewComponent,
    TopDashboardButtonComponent,
  ],
  templateUrl: './develop-page.component.html',
})
export class DevelopPageComponent implements OnInit {
  private readonly store = inject(Store);

  protected indexTimeline = 1;
  protected readonly tableOfContent = signal<TableOfContents>({
    items: [
      {
        title: 'Timeline',
        uuid: 'TimelineComponent',
        link: '/develop#TimelineComponent',
      },
      {
        title: 'Markdown Help',
        uuid: 'MarkdownHelpComponent',
        link: '/develop#MarkdownHelpComponent',
      },
      {
        title: 'Layout',
        uuid: 'LayoutTesting',
        link: '/develop#LayoutTesting',
      },
      {
        title: 'Loader',
        uuid: 'LoaderComponent',
        link: '/develop#LoaderComponent',
      },
      {
        title: 'Account View',
        uuid: 'SharedAccountViewComponent',
        link: '/develop#AccountViewComponent',
      },
      {
        title: 'Dashboard Top Button',
        uuid: 'TopDashboardButtonComponent',
        link: '/develop#TopDashboardButtonComponent',
      },
    ],
  });
  protected withoutAvatar = signal<AccountView>({
    uuid: 'uuid',
    name: 'John Doe',
    firstLetter: 'J',
    avatar: undefined,
  });
  protected withoutAvatarWithAvatar = computed(() => ({
    ...this.withoutAvatar(),
    avatar: {
      small: 'https://picsum.photos/50/50',
      full: 'https://picsum.photos/260/260',
    },
  }));

  ngOnInit(): void {
    this.store.dispatch(
      TableOfContentsActions.setTableOfContents(this.tableOfContent())
    );
  }
}
