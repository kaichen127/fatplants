import { TestBed } from '@angular/core/testing';

import { AralipsServiceService } from './aralips-service.service';

describe('AralipsServiceService', () => {
  let service: AralipsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AralipsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
