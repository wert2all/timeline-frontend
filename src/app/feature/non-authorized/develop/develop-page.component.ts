import { Component, OnInit, inject, signal } from '@angular/core';
import { TitleComponent } from '../../../shared/content/title/title.component';
import { LayoutComponent } from '../../../shared/layout/layout.component';

import { TableOfContentsContainerComponent } from '../../ui/table-of-contents/components/table-of-contents-container/table-of-contents-container.component';
import { TableOfContents } from '../../ui/table-of-contents/components/table-of-contents/table-of-contents.types';

import { Store } from '@ngrx/store';
import { SharedLoaderComponent } from '../../../shared/content/loader/loader.component';
import { Timeline } from '../../authorized/dashboard/store/timeline/timeline.types';
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
  ],
  templateUrl: './develop-page.component.html',
})
export class DevelopPageComponent implements OnInit {
  private readonly store = inject(Store);

  protected indexTimeline: Timeline = { id: 1, name: 'timeline' };
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
    ],
  });

  ngOnInit(): void {
    this.store.dispatch(
      TableOfContentsActions.setTableOfContents(this.tableOfContent())
    );
  }
}
