import { DateTime } from 'luxon';
import { ViewDatetime } from './date.types';

export const createViewDatetime = (
  date: Date,
  showTime: boolean
): ViewDatetime => {
  const dateTime = DateTime.fromISO(date.toISOString());

  return {
    relative: showTime ? dateTime.toRelative() : dateTime.toRelativeCalendar(),
    date:
      dateTime.toLocaleString(DateTime.DATE_SHORT) +
      (showTime ? ' ' + dateTime.toLocaleString(DateTime.TIME_24_SIMPLE) : ''),
  };
};
