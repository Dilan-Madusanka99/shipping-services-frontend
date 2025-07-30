import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselRegistrationComponent } from './vessel-registration.component';

describe('VesselRegistrationComponent', () => {
  let component: VesselRegistrationComponent;
  let fixture: ComponentFixture<VesselRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VesselRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VesselRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
