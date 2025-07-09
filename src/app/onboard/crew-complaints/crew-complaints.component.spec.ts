import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrewComplaintsComponent } from './crew-complaints.component';

describe('CrewComplaintsComponent', () => {
  let component: CrewComplaintsComponent;
  let fixture: ComponentFixture<CrewComplaintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrewComplaintsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrewComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
