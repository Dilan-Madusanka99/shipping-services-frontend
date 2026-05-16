import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSuggestionsComponent } from './job-suggestions.component';

describe('JobSuggestionsComponent', () => {
  let component: JobSuggestionsComponent;
  let fixture: ComponentFixture<JobSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobSuggestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
