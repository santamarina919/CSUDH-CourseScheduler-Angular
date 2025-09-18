import {PrerequisiteType} from "../data-models/Prerequisite";

export abstract class PrerequisiteNode {
  constructor(
    public prerequisiteId: string,
    public outgoingPrereqs: string[],
    public outgoingCourses: string[],
    public incomingPrereqs: string[],
    public type: PrerequisiteType,
    public parentCourse :string | null,
  ) {}

  public semesterCompleted : number | null = null

  protected completedCourses :Set<string> = new Set()

  protected completedChildPrereqs :Set<string> = new Set()


  public abstract isCompleted() : boolean

  public abstract notifyOfCompletedCourse(courseId :string, semester:number) : boolean

  public abstract notifyOfCompletedChild(prereqId :string, semester:number) : boolean

  public abstract notifyOfRemovedCourse(courseId :string) :boolean

  public abstract notifyOfRemovedPrereq(prereqId :string) : boolean

  protected abstract updateSemesterCompleted(semester: number) :void
}


export class AndPrerequisiteNode extends PrerequisiteNode{

  public isCompleted() {
    return this.completedChildPrereqs.size + this.completedCourses.size == this.outgoingPrereqs.length + this.outgoingCourses.length
  }

  public notifyOfCompletedCourse(courseId :string, semester :number){
    console.log(`${courseId} was added to semster ${semester}`)
    if(this.completedCourses.has(courseId)) throw new Error(`${courseId} was already present in completed courses set for AND prereq node ${this.prerequisiteId}`)
    this.completedCourses.add(courseId)
    this.updateSemesterCompleted(semester)
    return this.isCompleted()
  }

  public notifyOfCompletedChild(prereqId :string, semester :number){
    if(this.completedCourses.has(prereqId)) throw new Error(`${prereqId} was already present in completed prereqs set for AND prereq node ${this.prerequisiteId}`)
    this.completedChildPrereqs.add(prereqId)

    this.updateSemesterCompleted(semester);
    return this.isCompleted()
  }

  //TODO: removal of course can make semsester completed value stale
  notifyOfRemovedCourse(courseId: string): boolean {
    this.completedCourses.delete(courseId)
    return false;
  }

  notifyOfRemovedPrereq(prereqId: string): boolean {
    this.completedChildPrereqs.delete(prereqId)
    return false;
  }

  protected updateSemesterCompleted(semester: number) {
    if (this.semesterCompleted == null) {
      this.semesterCompleted = semester
    } else {
      this.semesterCompleted = Math.max(this.semesterCompleted, semester)
    }
  }
}

export class OrPrerequisiteNode extends PrerequisiteNode {

  public isCompleted(): boolean {
    return this.completedChildPrereqs.size > 0 || this.completedCourses.size > 0
  }

  public notifyOfCompletedChild(courseId: string, semester: number) {
    this.completedChildPrereqs.add(courseId)
    this.updateSemesterCompleted(semester)
    return this.isCompleted()
  }

  public notifyOfCompletedCourse(courseId: string, semester: number) {
    this.completedCourses.add(courseId)
    this.updateSemesterCompleted(semester)
    return this.isCompleted()
  }

  notifyOfRemovedCourse(courseId: string): boolean {
    this.completedCourses.delete(courseId)
    return this.isCompleted();
  }

  notifyOfRemovedPrereq(prereqId: string): boolean {
    this.completedChildPrereqs.delete(prereqId)
    return this.isCompleted();
  }

  protected updateSemesterCompleted(semester: number): void {
    if(this.semesterCompleted == null){
      this.semesterCompleted = semester
    }
    else {
      this.semesterCompleted = Math.min(semester)
    }
  }

}
