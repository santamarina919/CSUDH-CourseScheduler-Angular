import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {PlanDetails} from '../plans-page/PlanDetails';
import {CreatePlanFormModel} from '../create-plan-form/CreatePlanFormModel';
import {DegreeInfo} from '../create-plan-form/DegreeInfo';
import {PLAN_ID_QUERY_NAME} from '../utils/QueryParamaters';


@Injectable(
  {providedIn : "root"}
)
export class PlanService {
  http = inject(HttpClient)

  allPlans() {
     return this.http.get<PlanDetails[]>('api/degree/all',{withCredentials : true})
   }

   createPlan(data   :CreatePlanFormModel) {
      return this.http.post<PlanDetails>('api/degree/create', JSON.stringify(data),{headers : new HttpHeaders().set("Content-Type","application/json"), withCredentials : true})
    }


    allMajorsAvailable() {
     return this.http.get<DegreeInfo[]>('api/major/all',{withCredentials : true})
    }

    deletePlan(planId :string) {
      return this.http.delete('protected/api/degree/delete',{
          params : new HttpParams().set(PLAN_ID_QUERY_NAME,planId),
          withCredentials : true,
          observe : 'response'
        }
      )
    }

}
