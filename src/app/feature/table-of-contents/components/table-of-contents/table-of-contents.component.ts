import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  output,
  signal,
} from '@angular/core';
import { TableItem, TableOfContents } from './table-of-contents.types';

@Component({
  selector: 'app-table-of-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-of-contents.component.html',
  styleUrl: './table-of-contents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableOfContentsComponent implements OnInit {
  state = input.required<TableOfContents>();
  setActive = input<string | null>(null);
  clickItem = output<TableItem>();

  protected selected = signal<string | null>(null);

  protected itemClick(item: TableItem) {
    this.selected.set(item.uuid);
    this.clickItem.emit(item);
  }

  ngOnInit(): void {
    this.selected.set(this.setActive());
  }
}
