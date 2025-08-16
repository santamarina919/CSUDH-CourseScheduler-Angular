import {Component, inject, OnInit, Sanitizer} from '@angular/core';
import {MatList, MatListItem} from '@angular/material/list';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {PlansPageState} from './PlansPageState';
import {MatButton} from '@angular/material/button';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CreatePlanForm} from '../create-plan-form/create-plan-form';
import {MatIcon, MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {NgOptimizedImage} from '@angular/common';
import {DeletePlanDialog} from '../delete-plan-dialog/delete-plan-dialog';
import {PLAN_ID_QUERY_NAME} from '../utils/QueryParamaters';
import {PlanDetails} from './PlanDetails';

@Component({
  selector: 'app-plans-page',
  imports: [
    MatList,
    MatListItem,
    MatCard,
    MatCardTitle,
    MatButton,
    RouterLink,

    MatCardSubtitle,
  ],
  templateUrl: './plans-page.html',
  styleUrl: './plans-page.css'
})
export class PlansPage implements OnInit{

  planPageState = new PlansPageState();

  dialogRef = inject(MatDialog);

  deleteDialogRef = inject(MatDialog);


  ngOnInit() {
    this.planPageState.fetchAllPlans()
  }

  openCreatePlanDialog(){
    const dialog = this.dialogRef.open(CreatePlanForm)
    const comp = dialog.componentInstance
    comp.parentSubmitFunc = (success :boolean, plan :PlanDetails | null) => {
      if(!success) return
      this.planPageState.addPlan(plan!!)
      dialog.close()
    }
  }


  handleDeleteClick(planId :string) {
    const deleteRef = this.deleteDialogRef.open(DeletePlanDialog)
    deleteRef.componentInstance.affirmativeFunc = () => {
      this.planPageState.deletePlan(planId)
      this.deleteDialogRef.closeAll()
    }

    deleteRef.componentInstance.rejectionFunc = () => {
      this.deleteDialogRef.closeAll()
    }
  }
}
