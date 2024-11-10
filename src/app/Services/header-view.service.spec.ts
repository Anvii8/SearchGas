import { TestBed } from '@angular/core/testing';

import { HeaderViewService } from './header-view.service';

describe('HeaderViewService', () => {
  let service: HeaderViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
