import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  phosphorBug,
  phosphorCopyright,
  phosphorGithubLogo,
  phosphorYoutubeLogo,
} from '@ng-icons/phosphor-icons/regular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './footer.component.html',
  viewProviders: [
    provideIcons({
      phosphorBug,
      phosphorGithubLogo,
      phosphorYoutubeLogo,
      phosphorCopyright,
    }),
  ],
})
export class FooterComponent {}
