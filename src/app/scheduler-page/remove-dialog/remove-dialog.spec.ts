import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveDialog } from './remove-dialog';

describe('RemoveDialog', () => {
  let component: RemoveDialog;
  let fixture: ComponentFixture<RemoveDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
