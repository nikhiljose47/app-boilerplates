import { Routes } from '@angular/router';
import { AddPostComponent } from './compponents/add-post/add-post.component';
import { LocationPickerComponent } from './compponents/location-picker/location-picker.component';
import { PreviewComponent } from './compponents/preview/preview.component';

export const routes: Routes = [
      {
    path: 'add-post',
    component: AddPostComponent
  },
  {
    path: 'location',
    component: LocationPickerComponent
  },
  {
    path: 'preview',
    component: PreviewComponent
  },
  {
    path: '',
    redirectTo: 'add-post',
    pathMatch: 'full'
  }
];
