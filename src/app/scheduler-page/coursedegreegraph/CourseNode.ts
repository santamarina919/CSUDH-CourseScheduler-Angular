export class CourseNode {

  public semesterPlanned :number | null = null
  public semesterAvailable :number | null = null
  constructor(
    public courseId: string,
    public incomingRequirements: string[],
    public rootPrereq: string | null,
    public incomingPreqreqs: string[],
  ) {
  }
}
