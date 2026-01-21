import { Component } from '@angular/core';
import { PostDraftService } from '../../services/post-draft.service';

@Component({
  standalone: true,
  selector: 'app-preview',
  templateUrl: './preview.component.html'
})
export class PreviewComponent {

  constructor(public postDraft: PostDraftService) {}

  submitPost() {
    console.log('Uploading...', this.postDraft);
    alert('Post Uploaded!');
    this.postDraft.clear();
  }
}
