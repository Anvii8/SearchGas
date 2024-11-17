import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValorationsComponent } from './valorations.component';

describe('ValorationsComponent', () => {
  let component: ValorationsComponent;
  let fixture: ComponentFixture<ValorationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValorationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValorationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
