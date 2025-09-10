import {notTerm, Term} from '../scheduler-page/data-models/FullPlanDetails';


export function calcTerm(startTerm :Term,semesterNumber: number):Term {
  const isStartTerm = semesterNumber % 2 == 1
  if(isStartTerm){
    return startTerm
  }
  else {
    return notTerm(startTerm)
  }
}
