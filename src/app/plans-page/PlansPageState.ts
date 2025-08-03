import {PlanDetails} from './PlanDetails';
import {PlanService} from '../service/plan.service';
import {inject, Injectable, signal} from '@angular/core';


export class PlansPageState {

  private _plans = signal<PlanDetails[]>([])

  private planService = inject(PlanService)

  fetchAllPlans() {
    this.planService.allPlans().subscribe( response => {
        this._plans.set(response)
      }
    )
  }

  addPlan(plan :PlanDetails) {
    this._plans.set([...this._plans(),plan])
  }

  deletePlan(planId :string) {
    this.planService.deletePlan(planId).subscribe({
      next : () => {
        this._plans.set(this._plans().filter(plan => plan.id !== planId))
      }
    })
  }

  get plans(): PlanDetails[] {
    return this._plans()
  }



}
