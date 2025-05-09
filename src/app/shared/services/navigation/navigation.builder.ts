import { Injectable } from '@angular/core';
import { Undefined } from '../../../app.types';
import { Destination } from './navigation-builder.types';

class Url implements Destination {
  constructor(
    readonly url: string,
    readonly anchor: string | Undefined = undefined
  ) { }

  getUrl(): string {
    return this.url;
  }

  getAnchor(): string | Undefined {
    return this.anchor;
  }

  append(url: string, anchor: string | Undefined): Destination {
    return new Url([this.url, url].join('/'), anchor);
  }

  getFullUrlString(): string {
    if (this.anchor) {
      return `${this.url}#${this.anchor}`;
    }
    return this.url;
  }
}

class User {
  home(): Destination {
    return new Url('');
  }
  login(): Destination {
    return new Url('user/login');
  }
}

class Timeline {
  constructor(private readonly timelineId: number) { }

  show(): Destination {
    return new Url('timeline/' + this.timelineId);
  }
}

class Dashboard {
  private indexUrl = new Url('dashboard');

  index(): Destination {
    return this.indexUrl;
  }
  addTimeline(): Destination {
    return this.indexUrl.append('add-timeline', undefined);
  }
  addEvent(): Destination {
    return this.indexUrl.append('add-event', undefined);
  }
  editEvent(eventId: number): Destination {
    return this.indexUrl
      .append('edit-event', undefined)
      .append(eventId.toString(), 'text');
  }
}

@Injectable({
  providedIn: 'root',
})
export class NavigationBuilder {
  forDashboard() {
    return new Dashboard();
  }
  forTimeline(timelineId: number) {
    return new Timeline(timelineId);
  }
  forUser() {
    return new User();
  }
}
