import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { tableOfYearFeature } from '../../store/table-of-years/table-of-years.reducer';
import {
  Year,
  YearSubItems,
} from '../../store/table-of-years/table-of-years.types';
import { TableOfYearsActions } from '../../store/table-of-years/table-of-years.actions';

@Component({
  selector: 'app-table-of-years',
  standalone: true,
  templateUrl: './table-of-years.component.html',
})
export class TableOfYearsComponent {
  private readonly store = inject(Store);
  years = this.store.selectSignal(tableOfYearFeature.selectYears);

  setActiveYearAndMonth(year: Year, month?: YearSubItems) {
    this.store.dispatch(
      TableOfYearsActions.setActiveYear({
        year: year.number,
        month: month?.number,
      })
    );
  }
}
