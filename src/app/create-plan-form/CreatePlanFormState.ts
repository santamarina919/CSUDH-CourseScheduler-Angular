import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CreatePlanForm} from './create-plan-form';
import {CreatePlanFormModel} from './CreatePlanFormModel';
import {PlanService} from '../service/plan.service';
import {DegreeInfo} from './DegreeInfo';

@Injectable(
  {providedIn : "root"}
)
export class CreatePlanFormState  {


  private _planCreated = false;

  private _formError = false;

  private planService = inject(PlanService)

  majors :DegreeInfo[] | null = null

  submitForm(data :CreatePlanFormModel, onSuccess : () => void, onFailure : () => void){
    this.planService.createPlan(data).subscribe({
      next : () => {
        this._planCreated = true;
        this._formError = false;
        onSuccess();
      },
      error : () => {
        this._formError = true;
        this._planCreated = false;
        onFailure();
      }
    })
  }

  get planCreated(): boolean {
    return this._planCreated;
  }

  get formError(): boolean {
    return this._formError;
  }


  fetchMajors() {
    this.planService.allMajorsAvailable().subscribe(response => {
      this.majors = response;
    })
  }

}
