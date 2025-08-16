export class CourseNode {
  constructor(
    public courseId: string,
    public incomingRequirements: string[],
    public rootPrereq: string | null,
    public incomingPreqreqs: string[],
  ) {
  }
}
