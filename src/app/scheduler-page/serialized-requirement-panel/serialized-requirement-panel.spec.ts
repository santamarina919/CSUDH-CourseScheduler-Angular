import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerializedRequirementPanel } from './serialized-requirement-panel';

describe('SerializedRequirementPanel', () => {
  let component: SerializedRequirementPanel;
  let fixture: ComponentFixture<SerializedRequirementPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerializedRequirementPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerializedRequirementPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
