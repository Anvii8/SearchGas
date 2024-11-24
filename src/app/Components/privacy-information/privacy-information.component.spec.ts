import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyInformationComponent } from './privacy-information.component';

describe('PrivacyInformationComponent', () => {
  let component: PrivacyInformationComponent;
  let fixture: ComponentFixture<PrivacyInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivacyInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
