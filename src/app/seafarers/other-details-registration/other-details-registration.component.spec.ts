import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherDetailsRegistrationComponent } from './other-details-registration.component';

describe('OtherDetailsRegistrationComponent', () => {
  let component: OtherDetailsRegistrationComponent;
  let fixture: ComponentFixture<OtherDetailsRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherDetailsRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherDetailsRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
