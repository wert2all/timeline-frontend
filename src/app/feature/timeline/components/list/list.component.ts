import { Component, input, output } from '@angular/core';
import { Iterable } from '../../../../app.types';
import { SharedEventContentComponent } from '../../../../shared/ui/event/content/content.component';
import { ExistEventContent } from '../../../../shared/ui/event/content/content.types';
import { IconComponent } from '../event/icon/icon.component';
import { TimelineEventMenuComponent } from '../event/menu/menu.component';

@Component({
  standalone: true,
  selector: 'app-timeline-events-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [
    IconComponent,
    SharedEventContentComponent,
    TimelineEventMenuComponent,
  ],
})
export class ListComponent {
  events = input.required<ExistEventContent[]>();
  isEditable = input<boolean>(false);

  delete = output<Iterable>();
  edit = output<Iterable>();
}
