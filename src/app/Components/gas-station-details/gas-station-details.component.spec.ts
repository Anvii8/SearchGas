import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasStationDetailsComponent } from './gas-station-details.component';

describe('GasStationDetailsComponent', () => {
  let component: GasStationDetailsComponent;
  let fixture: ComponentFixture<GasStationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GasStationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GasStationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
