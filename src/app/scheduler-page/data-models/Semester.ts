import {Term} from './FullPlanDetails';

export class Semester {
  constructor(
    public semester: number = 0,
    public courses: string[] = [],
    public term: Term = "Fall",
    public year: number = 2019,
  ) {}
}
