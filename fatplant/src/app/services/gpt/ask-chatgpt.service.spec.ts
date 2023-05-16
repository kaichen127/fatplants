import { TestBed } from '@angular/core/testing';

import { AskChatgptService } from './ask-chatgpt.service';

describe('AskChatgptService', () => {
  let service: AskChatgptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AskChatgptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
