import {notTerm, Term} from '../scheduler-page/FullPlanDetails';


export function calcTerm(startTerm :Term,semesterNumber: number):Term {
  const isStartTerm = semesterNumber % 2 == 1
  if(isStartTerm){
    return startTerm
  }
  else {
    return notTerm(startTerm)
  }
}
