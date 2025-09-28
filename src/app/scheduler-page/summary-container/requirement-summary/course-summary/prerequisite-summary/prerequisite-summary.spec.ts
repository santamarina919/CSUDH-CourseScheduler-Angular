import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrerequisiteSummary } from './prerequisite-summary';

describe('PrerequisiteSummary', () => {
  let component: PrerequisiteSummary;
  let fixture: ComponentFixture<PrerequisiteSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrerequisiteSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrerequisiteSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
