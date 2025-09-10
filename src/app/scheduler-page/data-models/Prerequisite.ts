export type PrerequisiteType = "AND" | "OR"

export class Prerequisite {
  constructor(
    public prereqId: string,
    public parentCourse: string,
    public parentPrereq: string | null,
    public type: PrerequisiteType,
    public childrenPrereqs: string[],
    public leafCourses: string[]
  ) {
  }
}
