import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementSummary } from './requirement-summary';

describe('RequirementSummary', () => {
  let component: RequirementSummary;
  let fixture: ComponentFixture<RequirementSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequirementSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequirementSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
