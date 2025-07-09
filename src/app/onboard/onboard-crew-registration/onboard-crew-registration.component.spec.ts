import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardCrewRegistrationComponent } from './onboard-crew-registration.component';

describe('OnboardCrewRegistrationComponent', () => {
  let component: OnboardCrewRegistrationComponent;
  let fixture: ComponentFixture<OnboardCrewRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardCrewRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardCrewRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
