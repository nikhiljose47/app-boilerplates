import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { PostDraftService } from '../../services/post-draft.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  imports: [CommonModule, FormsModule]
})
export class LocationPickerComponent {

  query = '';
  searchResults: any[] = [];
  selectedPlace: any;
  map: any;

  constructor(
    private postDraft: PostDraftService,
    private router: Router
  ) { }

  async search() {
    if (!this.query.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${this.query}`;
    this.searchResults = await fetch(url).then(r => r.json());
  }

  select(place: any) {
    this.selectedPlace = place;

    setTimeout(() => {
      const lat = Number(place.lat);
      const lon = Number(place.lon);

      this.map = L.map('map').setView([lat, lon], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(this.map);

      L.marker([lat, lon]).addTo(this.map);

      const bb = this.selectedPlace.boundingbox;

      const bounds: L.LatLngBoundsExpression = [
        [Number(bb[0]), Number(bb[2])], // south, west
        [Number(bb[1]), Number(bb[3])]  // north, east
      ];

      L.rectangle(bounds, { color: 'blue', weight: 1 }).addTo(this.map);

    }, 50);
  }

  confirm() {
    this.postDraft.location = this.selectedPlace;
    this.router.navigate(['/preview']);
  }
}
