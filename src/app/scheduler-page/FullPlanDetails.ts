export type Term = "Fall" | "Spring"

export class FullPlanDetails {
  constructor(
    public id: string,
    public name: string,
    public term: Term,
    public year: number,
    public degreeId: string,
  ) {
  }
}


export function notTerm(term :Term) :Term {
  return term == "Fall" ? "Spring" : "Fall";
}
