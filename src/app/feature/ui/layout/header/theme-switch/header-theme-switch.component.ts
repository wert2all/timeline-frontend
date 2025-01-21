import { Component, inject } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { hugeMoon02, hugeSun03 } from '@ng-icons/huge-icons';
import { saxMoonBold } from '@ng-icons/iconsax/bold';
import { Store } from '@ngrx/store';
import { ThemeService } from '../../../../../services/theme.service';
import { applicationFeature } from '../../../../../store/application/application.reducers';
import { NotificationStore } from '../../../../../store/notifications/notifications.store';

@Component({
  selector: 'app-header-theme-switch',
  standalone: true,
  templateUrl: './header-theme-switch.component.html',
  styleUrls: ['./header-theme-switch.component.scss'],
  imports: [NgIconComponent],
  viewProviders: [provideIcons({ hugeMoon02, hugeSun03, saxMoonBold })],
})
export class HeaderThemeSwitchComponent {
  private readonly notificationStore = inject(NotificationStore);
  private readonly canUse = inject(Store).selectSignal(
    applicationFeature.canUseNecessaryCookies
  );

  protected readonly themeService = inject(ThemeService);
  protected readonly isDark = this.themeService.isDark;

  protected toggleTheme() {
    if (!this.canUse()) {
      this.notificationStore.addMessage(
        'Please  accept cookies to save your theme choice',
        'warning'
      );
    }
    this.themeService.toggleTheme();
  }
}
