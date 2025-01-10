import { Iterable } from '../app.types';

export const updateStateRecord = <T extends Iterable>(
  existStateRecord: Record<number, T>,
  items: T[]
): Record<number, T> => {
  if (items.length > 0) {
    return [...Object.values(existStateRecord), ...items].reduce(
      (acc: Record<number, T>, event) => {
        acc[event.id] = items.find(e => e.id === event.id) || event;
        return acc;
      },
      {}
    );
  }

  return existStateRecord;
};
