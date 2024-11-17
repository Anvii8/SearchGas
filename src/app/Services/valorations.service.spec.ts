import { TestBed } from '@angular/core/testing';

import { ValorationsService } from './valorations.service';

describe('ValorationsService', () => {
  let service: ValorationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValorationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
