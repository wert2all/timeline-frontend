import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { saxHierarchySquare3Outline } from '@ng-icons/iconsax/outline';
import { Store } from '@ngrx/store';
import { TimelineComponent } from '../../../feature/timeline/timeline.component';
import { HeroComponent } from '../../../share/hero/hero.component';
import { TitleComponent } from '../../../share/layout/content/title/title.component';
import { LayoutComponent } from '../../../share/layout/layout.component';

import { environment } from '../../../../environments/environment';
import { Status, StatusWithPending } from '../../../app.types';
import { createViewTimelineEvent } from '../../../feature/edit-event/editable-event-view.factory';
import { ImagesTaskExecutorFactory } from '../../../feature/task/executors/images.factory';
import { accountFeature } from '../../../store/account/account.reducer';
import {
  ExistTimelineEvent,
  TimelineEventType,
} from '../../../store/events/events.types';
import { imagesFeature } from '../../../store/images/images.reducer';
import { TaskActions } from '../../../store/task/task.actions';

@Component({
  selector: 'app-index-page',
  standalone: true,
  templateUrl: './index-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ saxHierarchySquare3Outline })],
  imports: [
    CommonModule,
    LayoutComponent,
    TimelineComponent,
    TitleComponent,
    HeroComponent,
  ],
})
export class IndexPageComponent {
  private store = inject(Store);

  private readonly rawImages = this.store.selectSignal(
    imagesFeature.selectLoadedImages
  );
  private readonly indexImages = [35];
  private readonly events = signal<ExistTimelineEvent[]>([
    {
      id: 0,
      timelineId: 0,
      date: new Date('2025-01-07T17:45:00.000+03:00'),
      type: TimelineEventType.default,
      title: 'images!',
      description:
        'after few months of development we add a new feature - images! now you could upload images to your timeline',
      tags: ['images', 'timeline', 'ui', 'feature', 'party', 'important'],
      url: 'https://timeln.rpm.kiev.ua/',
      showTime: true,
      loading: false,
      imageId: 35,
    },
    {
      id: 0,
      timelineId: 0,
      date: new Date('2024-05-26T15:21:00.000+03:00'),
      type: TimelineEventType.celebrate,
      title: 'we are alive!',
      description:
        'we are happy to announce the launch of our service! Now everyone can add their events and enjoy with us.',
      tags: [
        'server',
        'timeline',
        'ui',
        'feature',
        'party',
        'start',
        'important',
      ],
      url: 'https://timeln.rpm.kiev.ua/',
      showTime: true,
      loading: false,
    },
    {
      id: 0,
      timelineId: 0,
      date: new Date('2024-05-08T16:26:00.000+03:00'),
      type: TimelineEventType.default,
      title: 'remove it immediately!',
      description:
        'if you already used the previous feature that allowed you to add everything to your timeline, now you can delete everything!',
      tags: ['server', 'timeline', 'ui', 'feature'],
      showTime: true,
      loading: false,
    },
    {
      id: 0,
      timelineId: 0,
      date: new Date('2024-05-06T10:24:00.000+03:00'),
      type: TimelineEventType.default,
      title: 'it is not enough just to add, you need to get it',
      description:
        'finally! previously you could add your events only, but they began to show in the timeline today',
      tags: ['server', 'timeline', 'ui', 'show me your kung-fu', 'feature'],
      showTime: true,
      loading: false,
    },
    {
      id: 0,
      timelineId: 0,
      date: new Date('2024-04-17T18:24:00.000+03:00'),
      type: TimelineEventType.default,
      title: '33ae550a244a4267a3f07862420622fcd4f7498b',
      description: 'The backend server now knows how to authenticate users! ',
      tags: [
        'server',
        'auth',
        'timeline',
        'commit',
        'backend',
        'graphQL',
        'feature',
      ],
      showTime: true,
      loading: false,
    },
    {
      id: 0,
      timelineId: 0,
      date: new Date('2024-04-17T03:29:00.000+03:00'),
      type: TimelineEventType.default,
      title: 'first stream ever!',
      description:
        'The first stream where the first lines of the future GraphQL API were written was a blast.\n The stream was a lot of fun, and it was a great way to get the project off the ground. We made a lot of progress in a short amount of time, and we are all very excited about the future of the GraphQL API.',
      tags: ['stream', 'youtube', 'party', 'timeline'],
      url: 'https://www.youtube.com/watch?v=e39HHZiMEH4',
      loading: false,
    },
    {
      id: 0,
      timelineId: 0,
      date: new Date('2024-04-07T03:29:00.000+03:00'),
      type: TimelineEventType.default,
      title: 'we want to create **something** new',
      description: 'may be add **strong** tag',
      loading: false,
    },
    {
      id: 0,
      timelineId: 0,
      date: new Date('2024-04-06T03:29:00.000+03:00'),
      showTime: true,
      type: TimelineEventType.celebrate,
      title: 'first commit to timelime was pushed',
      tags: ['party', 'selebrate', 'start', 'timeline', 'important'],
      description:
        "We made our first commit to our new project. \n The first commit was a small one, but it represents a big step forward for us. It is a testament to the hard work and dedication of our team, who have been working tirelessly to make this project a reality. \n We are excited to continue working on 'timeline' and to share it with the world in the future. We believe that it has the potential to make a real difference in people's lives, and we are committed to making that happen.",
      url: 'https://github.com/wert2all/timeline-frontend/commit/613b8c200ab167c594965751c6c1e6ee6c873dad',
      loading: false,
    },
  ]);
  protected readonly isCollapsed = signal(true);

  protected readonly projectTimeline = computed(() => {
    const images = this.rawImages();
    return this.events().map(event => {
      let image = undefined;
      if (event.imageId) {
        image = images.find(i => i.id === event.imageId);
      }
      return {
        ...createViewTimelineEvent(event),
        id: event.id,
        image: image
          ? {
              imageId: image.id,
              previewUrl: image.data?.resized_490x250,
              status: this.convertImageStatus(image.status),
            }
          : undefined,
      };
    });
  });

  protected readonly isAuthorized = this.store.selectSignal(
    accountFeature.isAuthorized
  );

  constructor() {
    this.store.dispatch(
      TaskActions.createTask({
        task: ImagesTaskExecutorFactory.createTaskProps(
          this.indexImages,
          environment.services.previewly.token
        ),
      })
    );
  }

  toggleCollapse() {
    this.isCollapsed.set(!this.isCollapsed());
  }

  private convertImageStatus(status: StatusWithPending): Status {
    switch (status) {
      case Status.ERROR:
        return Status.ERROR;
      case Status.SUCCESS:
        return Status.SUCCESS;
      default:
        return Status.LOADING;
    }
  }
}
