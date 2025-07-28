import {PlanDetails} from './PlanDetails';
import {PlanService} from '../service/plan.service';
import {inject, Injectable} from '@angular/core';

@Injectable(
  {providedIn : "root"}
)
export class PlansPageState {

  private _plans :PlanDetails[] = []

  private planService = inject(PlanService)

  fetchAllPlans() {
    this.planService.allPlans().subscribe( response =>
      this._plans = response
    )
  }

  get plans(): PlanDetails[] {
    return this._plans;
  }

}
