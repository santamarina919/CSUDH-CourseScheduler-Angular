import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerPage } from './scheduler-page';

describe('SchedulerPage', () => {
  let component: SchedulerPage;
  let fixture: ComponentFixture<SchedulerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedulerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
