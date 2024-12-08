import { Component, computed, input, signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-edit-event-form-tabs',
  templateUrl: './tabs.component.html',
})
export class TabsComponent {
  openTab = input(0);

  protected readonly switchTab = signal<null | number>(null);
  protected readonly activeStep = computed(() =>
    this.switchTab() !== null ? this.switchTab() : this.openTab()
  );

  protected isActiveTab(tabNumber: number): boolean {
    return this.activeStep() === tabNumber;
  }
}
