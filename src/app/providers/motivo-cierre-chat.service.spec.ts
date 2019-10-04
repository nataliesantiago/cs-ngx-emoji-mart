import { TestBed } from '@angular/core/testing';

import { MotivoCierreChatService } from './motivo-cierre-chat.service';

describe('MotivoCierreChatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MotivoCierreChatService = TestBed.get(MotivoCierreChatService);
    expect(service).toBeTruthy();
  });
});
