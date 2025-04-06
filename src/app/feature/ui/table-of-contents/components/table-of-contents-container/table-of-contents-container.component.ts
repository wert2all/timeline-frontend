import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { phosphorArrowUpRight } from '@ng-icons/phosphor-icons/regular';
import { TableOfContentsComponent } from '../table-of-contents/table-of-contents.component';
import { TableOfContents } from '../table-of-contents/table-of-contents.types';

@Component({
  selector: 'app-table-of-contents-container',
  standalone: true,
  imports: [CommonModule, NgIconComponent, TableOfContentsComponent],
  templateUrl: './table-of-contents-container.component.html',
  styleUrls: ['./table-of-contents-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ phosphorArrowUpRight })],
})
export class TableOfContentsContainerComponent {
  state = input.required<TableOfContents>();
  isOpen = input<boolean>(false);

  setActive = input<string | null>(null);
}
