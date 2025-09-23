import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryContainer } from './summary-container';

describe('SummaryContainer', () => {
  let component: SummaryContainer;
  let fixture: ComponentFixture<SummaryContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
