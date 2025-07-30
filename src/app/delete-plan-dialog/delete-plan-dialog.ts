import { Component } from '@angular/core';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-delete-plan-dialog',
  imports: [
    MatButton
  ],
  templateUrl: './delete-plan-dialog.html',
  styleUrl: './delete-plan-dialog.css'
})
export class DeletePlanDialog {

  affirmativeFunc = () => {
    console.log('Default function called for affirmative');
  }

  rejectionFunc = () => {
    console.log('Default function called for rejection');
  }


}
