import { TestBed } from '@angular/core/testing';

import { PostDraftService } from './post-draft.service';

describe('PostDraftService', () => {
  let service: PostDraftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostDraftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
