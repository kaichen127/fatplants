import { TestBed } from '@angular/core/testing';

import { AbstractConnectionService } from './abstract-connection.service';

describe('AbstractConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AbstractConnectionService = TestBed.get(AbstractConnectionService);
    expect(service).toBeTruthy();
  });
});
