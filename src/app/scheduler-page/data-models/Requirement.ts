export type RequirementType = "AND" | "OR"

export class Requirement {
  constructor(
    public requirementId: string,
    public name: string | null,
    public type: RequirementType,
    public childRequirements: string[],
    public leafCourses: string[]) {
  }
}
