import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningContainer } from './planning-container';

describe('PlanningContainer', () => {
  let component: PlanningContainer;
  let fixture: ComponentFixture<PlanningContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
