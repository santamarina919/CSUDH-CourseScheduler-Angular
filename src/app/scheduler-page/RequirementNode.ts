export class RequirementNode {
  constructor(
    public requirementId: string,
    public outgoingRequirements: string[],
    public outgoingCourses: string[],
    public incomingRequirements: string[]
  ) {
  }
}
