import { Component, input, output } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { Tabs } from './tabs.types';

@Component({
  standalone: true,
  selector: 'app-shared-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [NgIconComponent],
})
export class SharedTabsComponent {
  tabs = input<Tabs[]>([]);
  activeTab = input.required<Tabs>();

  switchTab = output<Tabs>();
}
