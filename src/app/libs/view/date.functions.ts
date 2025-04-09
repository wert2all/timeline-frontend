import { DateTime } from 'luxon';
import { ViewDatetime } from './date.types';

//todo remove it
export const createViewDatetime = (
  date: Date,
  showTime: boolean
): ViewDatetime => {
  const dateTime = DateTime.fromISO(date.toISOString());

  return {
    originalDate: date,
    relative: dateTime.toRelative(),
    date: dateTime.toFormat('dd LLL yyyy' + (showTime ? ', HH:mm' : '')),
    time: dateTime.toLocaleString(DateTime.TIME_24_SIMPLE),
  };
};
