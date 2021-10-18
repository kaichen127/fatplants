import { TestBed } from '@angular/core/testing';

import { FirestoreAccessService } from './firestore-access.service';

describe('FirestoreAccessService', () => {
  let service: FirestoreAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
