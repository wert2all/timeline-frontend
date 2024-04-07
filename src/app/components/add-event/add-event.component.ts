import { Component } from "@angular/core";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { saxAddOutline } from "@ng-icons/iconsax/outline";

@Component({
  selector: "app-add-event",
  imports: [NgIconComponent],
  standalone: true,
  templateUrl: "./add-event.component.html", providers: [provideIcons({ saxAddOutline })]
})
export class AddEventComponent { }
