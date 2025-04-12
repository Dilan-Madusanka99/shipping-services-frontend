import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeaServicesComponent } from './sea-services.component';

describe('SeaServicesComponent', () => {
  let component: SeaServicesComponent;
  let fixture: ComponentFixture<SeaServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeaServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeaServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
