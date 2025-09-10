import {Term} from './FullPlanDetails';

export class Semester {
  constructor(
    public semester: number,
    public courses: string[],
    public term: Term,
    public year: number,
  ) {}
}
