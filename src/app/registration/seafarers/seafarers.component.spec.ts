import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeafarersComponent } from './seafarers.component';

describe('SeafarersComponent', () => {
  let component: SeafarersComponent;
  let fixture: ComponentFixture<SeafarersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeafarersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeafarersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
