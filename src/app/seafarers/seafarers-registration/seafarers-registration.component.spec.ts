import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeafarersRegistrationComponent } from './seafarers-registration.component';

describe('SeafarersRegistrationComponent', () => {
  let component: SeafarersRegistrationComponent;
  let fixture: ComponentFixture<SeafarersRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeafarersRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeafarersRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
