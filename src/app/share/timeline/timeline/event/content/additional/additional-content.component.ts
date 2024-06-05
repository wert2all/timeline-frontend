import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { EditEventFormComponent } from '../../../../../../widgets/timeline-container/edit-event-form/edit-event-form.component';
import {
  AddValue,
  EditableTimelineTypes,
  EditableViewTimelineEvent,
} from '../../../../../../widgets/timeline-container/timeline.types';
import { TimelineEventMenuComponent } from '../../menu/menu.component';
type EventView = EditableViewTimelineEvent & {
  eventLength: string;
  shouldAccentLine: boolean;
};

@Component({
  selector: 'app-timeline-event-additional-content',
  templateUrl: './additional-content.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './additional-content.component.scss',
  imports: [EditEventFormComponent, TimelineEventMenuComponent],
})
export class EventAdditionalContentComponent {
  EditableTimelineTypes = EditableTimelineTypes;
  event = input.required<EventView>();

  saveEvent = output();
  dismissAction = output();
  changeValues = output<AddValue>();
  onDelete = output<EditableViewTimelineEvent>();
}
