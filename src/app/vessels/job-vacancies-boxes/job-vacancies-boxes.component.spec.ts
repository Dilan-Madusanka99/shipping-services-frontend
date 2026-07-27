import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobVacanciesBoxesComponent } from './job-vacancies-boxes.component';

describe('JobVacanciesBoxesComponent', () => {
  let component: JobVacanciesBoxesComponent;
  let fixture: ComponentFixture<JobVacanciesBoxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobVacanciesBoxesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobVacanciesBoxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
