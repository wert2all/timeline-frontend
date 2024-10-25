import { AsyncPipe } from '@angular/common';
import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

@Component({
  standalone: true,
  imports: [AsyncPipe],
  selector: 'app-markdown-content',
  template: '<div class="markdown" [innerHTML]="parsed() | async"></div>',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./markdown-content.component.scss'],
})
export class MarkdownContentComponent {
  content = input.required<string>();

  parsed = computed(() =>
    unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .process(this.content())
  );
}
