import { AsyncPipe } from '@angular/common';
import { Component, ViewEncapsulation, input } from '@angular/core';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';

@Component({
  standalone: true,
  providers: [provideMarkdown()],
  imports: [MarkdownModule, AsyncPipe],
  selector: 'app-markdown-content',
  template:
    '<div class="markdown" [innerHTML]="content() | markdown | async"></div>',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./markdown-content.component.scss'],
})
export class MarkdownContentComponent {
  content = input.required<string>();
}
