import { Injectable } from '@angular/core';
import { Status, Undefined } from '../../../../app.types';
import { ExistTimelineEvent } from '../../../../feature/timeline/store/timeline.types';
import { createViewDatetime } from '../../../../libs/view/date.functions';
import { UploadedImage } from '../../../store/images/images.types';
import {
  EventContentIcon,
  EventContentImage,
  EventContentTag,
  ExistEventContent,
} from './content.types';

@Injectable({ providedIn: 'root' })
export class EventContentConvertor {
  fromExistEvent(
    event: ExistTimelineEvent,
    image: UploadedImage | Undefined
  ): ExistEventContent {
    return {
      ...event,
      description: event.description || '',
      icon: new EventContentIcon(event.type),
      url: this.prepareUrl(event.url),
      date: createViewDatetime(event.date, event.showTime || false),
      tags: event.tags?.map(tag => new EventContentTag(tag)) || [],
      image: event.imageId ? this.extractImage(event.imageId, image) : null,
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
}
