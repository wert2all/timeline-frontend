import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { tableOfYearFeature } from '../../store/table-of-years/table-of-years.reducer';
import { Year } from '../../store/table-of-years/table-of-years.types';
import { TableOfYearsActions } from '../../store/table-of-years/table-of-years.actions';

@Component({
  selector: 'app-table-of-years',
  standalone: true,
  templateUrl: './table-of-years.component.html',
})
export class TableOfYearsComponent {
  private readonly store = inject(Store);
  private readonly rawYears = this.store.selectSignal(
    tableOfYearFeature.selectYears
  );

  years = computed(() =>
    this.rawYears().map(year => ({
      ...year,
      delimiters: Array.from({ length: year.skipCount }),
    }))
  );

  setActiveYear(year: Year) {
    this.store.dispatch(
      TableOfYearsActions.setActiveYear({ year: year.number })
    );
  }
}
