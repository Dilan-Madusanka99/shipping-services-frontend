import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsRegistrationComponent } from './items-registration.component';

describe('ItemsRegistrationComponent', () => {
  let component: ItemsRegistrationComponent;
  let fixture: ComponentFixture<ItemsRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemsRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
