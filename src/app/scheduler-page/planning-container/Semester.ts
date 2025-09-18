import {Term} from '../data-models/FullPlanDetails';

export class Semester {
  constructor(
    public semester: number = 0,
    public courses: [string,string][] = [],
    public term: Term = "Fall",
    public year: number = 2019,
  ) {}
}

export const COURSE_ID = 0
export const COURSE_NAME = 1
