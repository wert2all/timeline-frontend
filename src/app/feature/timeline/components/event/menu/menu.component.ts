import { Component, input, output, signal } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { phosphorHeartDuotone } from '@ng-icons/phosphor-icons/duotone';
import {
  phosphorLinkSimpleHorizontal,
  phosphorPencilLine,
  phosphorTrash,
} from '@ng-icons/phosphor-icons/regular';
import { Iterable } from '../../../../../app.types';
import { FeatureFlagComponent } from '../../../../ui/feature-flag/feature-flag.component';

@Component({
  standalone: true,
  imports: [NgIconComponent, FeatureFlagComponent],
  selector: 'app-timeline-event-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  viewProviders: [
    provideIcons({
      phosphorPencilLine,
      phosphorTrash,
      phosphorLinkSimpleHorizontal,
      phosphorHeartDuotone,
    }),
  ],
})
export class TimelineEventMenuComponent {
  timelineEvent = input.required<Iterable>();
  isEditable = input.required<boolean>();
  isAuthorized = input.required<boolean>();

  delete = output<Iterable>();
  edit = output<Iterable>();
  copyLink = output<Iterable>();
  like = output<Iterable>();

  protected copied = signal(false);
  protected liked = signal(false);

  protected likeClick(item: Iterable) {
    this.liked.set(true);
    this.like.emit(item);
    setTimeout(() => this.liked.set(false), 3000);
  }

  protected copyClick(item: Iterable) {
    this.copied.set(true);
    this.copyLink.emit(item);
    setTimeout(() => this.copied.set(false), 3000);
  }
}
