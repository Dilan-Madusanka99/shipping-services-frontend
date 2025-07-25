import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsByMonthlyComponent } from './payments-by-monthly.component';

describe('PaymentsByMonthlyComponent', () => {
  let component: PaymentsByMonthlyComponent;
  let fixture: ComponentFixture<PaymentsByMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsByMonthlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsByMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
