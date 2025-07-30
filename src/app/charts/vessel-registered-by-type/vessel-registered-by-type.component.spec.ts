import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselRegisteredByTypeComponent } from './vessel-registered-by-type.component';

describe('VesselRegisteredByTypeComponent', () => {
  let component: VesselRegisteredByTypeComponent;
  let fixture: ComponentFixture<VesselRegisteredByTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VesselRegisteredByTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VesselRegisteredByTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
