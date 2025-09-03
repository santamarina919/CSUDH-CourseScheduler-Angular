import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrereqPanel } from './prereq-panel';

describe('PrereqPanel', () => {
  let component: PrereqPanel;
  let fixture: ComponentFixture<PrereqPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrereqPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrereqPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
