import {PrerequisiteType} from "./Prerequisite";

export class PrerequisiteNode {
  constructor(
    public prerequisiteId: string,
    public outgoingPrereqs: string[],
    public outgoingCourses: string[],
    public incomingPrereqs: string[],
    public type: PrerequisiteType,
    public parentCourse :string | null,
  ) {
  }
}
