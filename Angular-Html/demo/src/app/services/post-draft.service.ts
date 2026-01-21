import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PostDraftService {

  photos: File[] = [];
  photoPreviews: string[] = [];

  caption: string = '';
  location: any = null;

  clear() {
    this.photos = [];
    this.photoPreviews = [];
    this.caption = '';
    this.location = null;
  }
}
