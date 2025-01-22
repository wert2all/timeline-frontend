import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { TitleComponent } from '../../../shared/layout/content/title/title.component';
import { LayoutComponent } from '../../../shared/layout/layout.component';

import { TableOfContentsContainerComponent } from '../../../feature/table-of-contents/components/table-of-contents-container/table-of-contents-container.component';
import { TableOfContents } from '../../../feature/table-of-contents/components/table-of-contents/table-of-contents.types';

import { TimelineComponent } from '../../../feature/timeline/timeline.component';

import { Store } from '@ngrx/store';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { TableOfContentsActions } from '../../../store/table-of-contents/table-of-contents.actions';
import { MarkdownHelpComponent } from '../static/markdown-help/markdown-help.component';
import { DevelopContentComponent } from './components/develop-content/develop-content.component';

@Component({
  selector: 'app-develop-page',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    TitleComponent,
    TimelineComponent,
    DevelopContentComponent,
    TableOfContentsContainerComponent,
    LoaderComponent,
    MarkdownHelpComponent,
  ],
  templateUrl: './develop-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevelopPageComponent implements OnInit {
  private readonly store = inject(Store);

  protected readonly tableOfContent = signal<TableOfContents>({
    items: [
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
