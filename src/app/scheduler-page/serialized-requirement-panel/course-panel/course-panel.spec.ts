import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePanel } from './course-panel';

describe('CoursePanel', () => {
  let component: CoursePanel;
  let fixture: ComponentFixture<CoursePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursePanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
