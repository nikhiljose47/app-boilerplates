import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostDraftService } from '../../services/post-draft.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-post',
  standalone: true,
  templateUrl: './add-post.component.html',
  imports: [FormsModule, CommonModule]
})
export class AddPostComponent {

  constructor(
    public postDraft: PostDraftService,
    private router: Router
  ) {}

  onPhotosSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.postDraft.photos = files;
    this.postDraft.photoPreviews = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () =>
        this.postDraft.photoPreviews.push(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  goLocation() {
    this.router.navigate(['/location']);
  }
}