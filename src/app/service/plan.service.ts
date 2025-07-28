import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {PlanDetails} from '../plans-page/PlanDetails';
import {CreatePlanFormModel} from '../create-plan-form/CreatePlanFormModel';
import {DegreeInfo} from '../create-plan-form/DegreeInfo';


class DegreePlan {
  constructor(
    public id :number,
    public name :string,
    public majorId :string,
    public year :string,
    public term :string,
  ) {
  }

}

@Injectable(
  {providedIn : "root"}
)
export class PlanService {
  http = inject(HttpClient)

  allPlans() {
     return this.http.get<PlanDetails[]>('api/degree/all',{withCredentials : true})
   }

   createPlan(data   :CreatePlanFormModel) {
      return this.http.post<DegreePlan>('api/degree/create', JSON.stringify(data),{headers : new HttpHeaders().set("Content-Type","application/json"), withCredentials : true})
    }


    allMajorsAvailable() {
     return this.http.get<DegreeInfo[]>('api/major/all',{withCredentials : true})
    }

}
