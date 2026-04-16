import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandbyCrewMembersComponent } from './standby-crew-members.component';

describe('StandbyCrewMembersComponent', () => {
  let component: StandbyCrewMembersComponent;
  let fixture: ComponentFixture<StandbyCrewMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandbyCrewMembersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandbyCrewMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
