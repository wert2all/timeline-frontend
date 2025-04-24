import { Injectable } from '@angular/core';
import { Destination } from './navigation-builder.types';

class Url implements Destination {
  constructor(private readonly url: string) {}

  append(url: string): Destination {
    return new Url([this.url, url].join('/'));
  }
  toString() {
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
  constructor(private readonly timelineId: number) {}

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
    return this.indexUrl.append('add-timeline');
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
