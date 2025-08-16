import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {PlanDetails} from '../plans-page/PlanDetails';
import {CreatePlanFormModel} from '../create-plan-form/CreatePlanFormModel';
import {DegreeInfo} from '../create-plan-form/DegreeInfo';
import {PLAN_ID_QUERY_NAME} from '../utils/QueryParamaters';
import {FullPlanDetails} from '../scheduler-page/FullPlanDetails';
import {PlannedCourse} from '../scheduler-page/PlannedCourse';


@Injectable(
  {providedIn : "root"}
)
export class PlanService {
  http = inject(HttpClient)

 allPlans() {
   return this.http.get<PlanDetails[]>('/api/degree/all',{withCredentials : true})
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

  planDetails(planId :string) {
      return this.http.get<FullPlanDetails>('protected/api/plan/details',{params : new HttpParams().set(PLAN_ID_QUERY_NAME,planId), withCredentials : true})
  }

  plannedCourses(planId: string) {
    return this.http.get<PlannedCourse[]>('protected/api/plan/planned', {params : new HttpParams().set(PLAN_ID_QUERY_NAME,planId), withCredentials : true})
  }
}
