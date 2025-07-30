import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatesRegistrationComponent } from './certificates-registration.component';

describe('CertificatesRegistrationComponent', () => {
  let component: CertificatesRegistrationComponent;
  let fixture: ComponentFixture<CertificatesRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificatesRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificatesRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
