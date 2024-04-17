import { Component, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  saxArrowLeft2Outline,
  saxArrowRight3Outline,
} from '@ng-icons/iconsax/outline';
@Component({
  standalone: true,
  selector: 'app-date-picker',
  imports: [NgIconComponent, FormsModule],
  templateUrl: './date-picker.component.html',
  viewProviders: [
    provideIcons({ saxArrowLeft2Outline, saxArrowRight3Outline }),
  ],
})
export class DatePickerComponent implements OnInit {
  MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  month!: number; // !: mean promise it will not be null, and it will definitely be assigned
  year!: number;
  no_of_days = [] as number[];
  blankdays = [] as number[];

  selectDate = output<Date>();

  constructor() {}

  ngOnInit(): void {
    this.initDate();
    this.getNoOfDays();
  }

  initDate() {
    const today = new Date();
    this.month = today.getMonth();
    this.year = today.getFullYear();
    this.selectDate.emit(new Date(this.year, this.month, today.getDate()));
  }

  isToday(date: number) {
    const today = new Date();
    const d = new Date(this.year, this.month, date);
    return today.toDateString() === d.toDateString();
  }

  getDateValue(date: number) {
    const selectedDate = new Date(this.year, this.month, date);
    this.selectDate.emit(selectedDate);
  }

  getNoOfDays() {
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

    // find where to start calendar day of week
    const dayOfWeek = new Date(this.year, this.month).getDay();
    const blankdaysArray = [];
    for (let i = 1; i <= dayOfWeek; i++) {
      blankdaysArray.push(i);
    }

    const daysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    this.blankdays = blankdaysArray;
    this.no_of_days = daysArray;
  }

  switchMonth(monthDelta: number) {
    this.month = this.month + monthDelta;
    this.getNoOfDays();
  }
}
