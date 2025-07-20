import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeafarersRegisteredByMonthlyComponent } from './seafarers-registered-by-monthly.component';

describe('SeafarersRegisteredByMonthlyComponent', () => {
  let component: SeafarersRegisteredByMonthlyComponent;
  let fixture: ComponentFixture<SeafarersRegisteredByMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeafarersRegisteredByMonthlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeafarersRegisteredByMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
