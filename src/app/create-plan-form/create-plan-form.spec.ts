import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlanForm } from './create-plan-form';

describe('CreatePlanForm', () => {
  let component: CreatePlanForm;
  let fixture: ComponentFixture<CreatePlanForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePlanForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePlanForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
