import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeafarersDocComponent } from './seafarers-doc.component';

describe('SeafarersDocComponent', () => {
  let component: SeafarersDocComponent;
  let fixture: ComponentFixture<SeafarersDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeafarersDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeafarersDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
