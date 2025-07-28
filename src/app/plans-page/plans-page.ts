import {Component, inject, OnInit} from '@angular/core';
import {MatList, MatListItem} from '@angular/material/list';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {PlanService} from '../service/plan.service';
import {PlansPageState} from './PlansPageState';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CreatePlanForm} from '../create-plan-form/create-plan-form';

@Component({
  selector: 'app-plans-page',
  imports: [
    MatList,
    MatListItem,
    MatCard,
    MatCardTitle,
    MatButton,
    RouterLink,
  ],
  templateUrl: './plans-page.html',
  styleUrl: './plans-page.css'
})
export class PlansPage implements OnInit{

  planPageState = inject(PlansPageState);

  dialogRef = inject(MatDialog);

  router = inject(Router)

  ngOnInit() {
    this.planPageState.fetchAllPlans()
  }

  openDialog(){
    const dialog = this.dialogRef.open(CreatePlanForm)
    const comp = dialog.componentInstance
    comp.parentSubmitFunc = () => {
      dialog.close()
    }
  }


}
