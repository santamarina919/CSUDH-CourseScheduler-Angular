import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSummary } from './course-summary';

describe('CourseSummary', () => {
  let component: CourseSummary;
  let fixture: ComponentFixture<CourseSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
