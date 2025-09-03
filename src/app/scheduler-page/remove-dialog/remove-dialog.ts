import {Component, Inject, inject, input} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {Course} from '../Course';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-remove-dialog',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatButton
  ],
  templateUrl: './remove-dialog.html',
  styleUrl: './remove-dialog.css'
})
export class RemoveDialog {

  displayedColumns = ['id','name','semesterAvailable'];

  toBeRemoved :Course[] = []

  onRemoveClick :() => void

  constructor(@Inject(MAT_DIALOG_DATA) public data : {toBeRemoved: Course[], onRemoveClick : () => void}, public dialogRef: MatDialogRef<RemoveDialog>) {
    this.toBeRemoved = data.toBeRemoved;
    this.onRemoveClick = data.onRemoveClick;
    console.log(this.toBeRemoved.length);
  }

  protected readonly Number = Number;

  onYesClick() {
    this.onRemoveClick();
    this.dialogRef.close();
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
