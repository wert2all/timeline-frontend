import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { Status, Undefined } from '../../../../app.types';
import {
  ExistTimelineEvent,
  TimelineEvent,
} from '../../../../feature/events/store/events.types';
import { UploadedImage } from '../../../store/images/images.types';
import {
  EventContent,
  EventContentIcon,
  EventContentImage,
  EventContentTag,
  ExistEventContent,
  ViewDatetime,
} from './content.types';

@Injectable({ providedIn: 'root' })
export class EventContentConvertor {
  fromEvent(
    event: TimelineEvent,
    image: UploadedImage | Undefined
  ): EventContent {
    return {
      ...event,
      description: event.description || '',
      icon: new EventContentIcon(event.type),
      url: this.prepareUrl(event.url),
      date: this.createViewDatetime(event.date, event.showTime || false),
      tags: event.tags?.map(tag => new EventContentTag(tag)) || [],
      image: event.imageId ? this.extractImage(event.imageId, image) : null,
    };
  }

  fromExistEvent(
    event: ExistTimelineEvent,
    image: UploadedImage | Undefined
  ): ExistEventContent {
    return {
      ...this.fromEvent(event, image),
      id: event.id,
    };
  }

  private extractImage(
    imageId: number,
    image: UploadedImage | Undefined
  ): Undefined | EventContentImage {
    if (!image) {
      return { imageId, status: Status.LOADING };
    }

    const status = this.extractImageStatus(image);
    return {
      imageId,
      status,
      previewUrl:
        status === Status.SUCCESS ? image.data?.resized_490x250 : undefined,
    };
  }

  private extractImageStatus(image: UploadedImage): Status {
    return image.status === 'PENDING' ? Status.LOADING : image.status;
  }

  private prepareUrl(url: string | undefined) {
    try {
      return url ? { title: new URL(url).host, link: url } : null;
    } catch {
      return null;
    }
  }

  private createViewDatetime(date: Date, showTime: boolean): ViewDatetime {
    const dateTime = DateTime.fromISO(date.toISOString());

    return {
      originalDate: date,
      relative: dateTime.toRelative(),
      date: dateTime.toFormat('dd LLL yyyy' + (showTime ? ', HH:mm' : '')),
      time: dateTime.toLocaleString(DateTime.TIME_24_SIMPLE),
    };
  }
}
