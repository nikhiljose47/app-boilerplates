import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageService } from './service';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent implements OnInit, OnDestroy {
  // example list of remote image urls
  urls = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.png',
    // add your image URLs
  ];

  // map url -> objectUrl (string) or error message / placeholder state
  imageMap = new Map<string, { src?: string; loading: boolean; error?: string }>();
  private subs: Subscription[] = [];
  // minimum dimension filter
  minWidth = 200;
  minHeight = 200;

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    for (const u of this.urls) {
      this.imageMap.set(u, { loading: true });
      const sub = this.imageService.getImage(u, this.minWidth, this.minHeight).subscribe({
        next: (objUrl) => {
          const item = this.imageMap.get(u)!;
          item.src = objUrl;
          item.loading = false;
        },
        error: (err) => {
          const item = this.imageMap.get(u)!;
          item.error = (err && err.message) || 'Failed to load';
          item.loading = false;
        }
      });
      this.subs.push(sub);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    // optionally clear memory cache if you want to free object URLs
    this.imageService.clearMemoryCache();
  }
}
