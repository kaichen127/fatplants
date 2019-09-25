import { TestBed } from '@angular/core/testing';

import { LmpdArapidopsisConnectionService } from './lmpd-arapidopsis-connection.service';

describe('LmpdArapidopsisConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LmpdArapidopsisConnectionService = TestBed.get(LmpdArapidopsisConnectionService);
    expect(service).toBeTruthy();
  });
});
