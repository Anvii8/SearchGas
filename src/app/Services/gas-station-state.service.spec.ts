import { TestBed } from '@angular/core/testing';

import { GasStationStateService } from './gas-station-state.service';

describe('GasStationStateService', () => {
  let service: GasStationStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GasStationStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
