import { Injectable } from '@angular/core';
import { Destination } from './navigation-builder.types';

class Url implements Destination {
  constructor(private readonly url: string) {}
  toString() {
    return this.url;
  }
}
class User {
  home(): Destination {
    return new Url('');
  }
  dashboard(): Destination {
    return new Url('my');
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
@Injectable({
  providedIn: 'root',
})
export class NavigationBuilder {
  forTimeline(timelineId: number) {
    return new Timeline(timelineId);
  }
  forUser() {
    return new User();
  }
}
