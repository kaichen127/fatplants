import { TestBed } from '@angular/core/testing';

import { CustomPathwaysService } from './custom-pathways.service';

describe('CustomPathwaysService', () => {
  let service: CustomPathwaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomPathwaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
