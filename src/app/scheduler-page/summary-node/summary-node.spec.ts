import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryNode } from './summary-node';

describe('SummaryNode', () => {
  let component: SummaryNode;
  let fixture: ComponentFixture<SummaryNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryNode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryNode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
