import { Injectable, OnDestroy } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { switchMap, shareReplay, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ImageService implements OnDestroy {
  private cacheName = 'angular-image-cache-v1';
  // in-memory cache: url -> object URL
  private memoryCache = new Map<string, string>();
  // promises cache to dedupe concurrent fetches: url -> observable promise
  private inflight = new Map<string, Observable<string>>();

  constructor() {}

  /**
   * Get image url (object URL) that meets minWidth/minHeight
   * Returns Observable<string> with an object URL (URL.createObjectURL)
   */
  getImage(url: string, minWidth = 0, minHeight = 0): Observable<string> {
    if (!url) return throwError(() => new Error('No URL provided'));

    // Return memory cached object URL if available
    const mem = this.memoryCache.get(url);
    if (mem) return of(mem);

    // If a request for same url is inflight, return it
    const inflightObs = this.inflight.get(url);
    if (inflightObs) return inflightObs;

    // Create an Observable from the async flow
    const obs$ = from(this.fetchAndCache(url, minWidth, minHeight)).pipe(
      // shareReplay so multiple subscribers share the same result
      shareReplay(1),
      catchError(err => {
        // cleanup inflight on error too
        this.inflight.delete(url);
        return throwError(() => err);
      })
    );

    this.inflight.set(url, obs$);
    // after success or error we remove inflight in fetchAndCache or catchError path
    obs$.subscribe({
      next: () => this.inflight.delete(url),
      error: () => this.inflight.delete(url),
    });

    return obs$;
  }

  /** main async flow using browser cache API and image dimension check */
  private async fetchAndCache(url: string, minW: number, minH: number): Promise<string> {
    // 1) try memory (already checked in getImage, but double-safe)
    const mem = this.memoryCache.get(url);
    if (mem) return mem;

    // 2) Try Cache Storage
    try {
      const cache = await caches.open(this.cacheName);
      const cachedResp = await cache.match(url);
      if (cachedResp) {
        const blob = await cachedResp.blob();
        const objUrl = URL.createObjectURL(blob);
        // verify dimensions (in case cached earlier without size check)
        const ok = await this.checkImageDimensions(objUrl, minW, minH);
        if (ok) {
          this.memoryCache.set(url, objUrl);
          return objUrl;
        } else {
          // not acceptable size => remove from cache and continue to re-download
          await cache.delete(url);
          URL.revokeObjectURL(objUrl);
        }
      }
    } catch (err) {
      // Cache API might not be available or blocked — ignore and continue
      console.warn('Cache API not available or failed:', err);
    }

    // 3) Try a lightweight HEAD to check if file exists (optional)
    // Note: Many servers don't respond to HEAD or won't provide dimensions — this is best-effort.
    try {
      const headResp = await fetch(url, { method: 'HEAD' });
      if (!headResp.ok && headResp.status !== 405) {
        // server didn't like HEAD; we'll continue to GET anyway
      }
      // content-length based filtering is unreliable for pixel dimensions so skipping strict checks here
    } catch (err) {
      // HEAD failed; proceed to GET
    }

    // 4) Fetch the image as blob
    const resp = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store' });
    if (!resp.ok) throw new Error(`Failed to fetch image: ${resp.status} ${resp.statusText}`);

    const blob = await resp.blob();

    // create object URL for dimension check
    const objUrl = URL.createObjectURL(blob);
    const ok = await this.checkImageDimensions(objUrl, minW, minH);
    if (!ok) {
      URL.revokeObjectURL(objUrl);
      throw new Error('Image does not meet minimum dimensions');
    }

    // 5) Put into Cache Storage for future usage
    try {
      const cache = await caches.open(this.cacheName);
      // response needs to be a Response object; clone because blob will be used to create objectURL
      const responseForCache = new Response(blob, {
        headers: { 'Content-Type': blob.type || 'application/octet-stream' },
      });
      await cache.put(url, responseForCache);
    } catch (err) {
      console.warn('Failed to write to Cache Storage:', err);
    }

    // store in memory and return
    this.memoryCache.set(url, objUrl);
    return objUrl;
  }

  /** load image and check naturalWidth/naturalHeight */
  private checkImageDimensions(objectUrl: string, minW: number, minH: number): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const ok = img.naturalWidth >= minW && img.naturalHeight >= minH;
        // cleanup image element
        img.onload = null;
        img.onerror = null;
        resolve(ok);
      };
      img.onerror = () => {
        img.onload = null;
        img.onerror = null;
        resolve(false);
      };
      img.src = objectUrl;
      // in case image is cached and immediate, the onload will fire synchronously or soon
    });
  }

  /** revoke all in-memory object URLs (call on destroy or when you want free memory) */
  clearMemoryCache() {
    for (const url of this.memoryCache.values()) {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    }
    this.memoryCache.clear();
  }

  async clearPersistentCache() {
    try {
      await caches.delete(this.cacheName);
    } catch (err) {
      console.warn('Failed to clear cache storage:', err);
    }
  }

  ngOnDestroy(): void {
    this.clearMemoryCache();
  }
}
