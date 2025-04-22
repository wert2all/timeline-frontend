import { Injectable } from '@angular/core';

class Url {
  constructor(private readonly url: string) { }
  toString() {
    return this.url;
  }
}
class User {
  dashboard() {
    return new Url('my');
  }
  login() {
    return new Url('user/login');
  }
}
@Injectable({
  providedIn: 'root',
})
export class NavigationBuilder {
  forUser() {
    return new User();
  }
}
