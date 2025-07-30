import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePlanDialog } from './delete-plan-dialog';

describe('DeletePlanDialog', () => {
  let component: DeletePlanDialog;
  let fixture: ComponentFixture<DeletePlanDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePlanDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePlanDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
