import {Prerequisite, PrerequisiteType} from "../data-models/Prerequisite";
import {Course} from '../data-models/Course';
import {ShowOnDirtyErrorStateMatcher} from '@angular/material/core';

export abstract class PrerequisiteNode {
  constructor(
    public prerequisiteId: string,
    public outgoingPrereqs: string[],
    public outgoingCourses: string[],
    public incomingPrereqs: string[],
    public type: PrerequisiteType,
    public parentCourse :string | null,
  ) {}

  protected semesterCompleted : number | null = null

  protected completedCourses :Set<string> = new Set()

  protected completedChildPrereqs :Set<string> = new Set()


  public abstract isCompleted() : boolean

  public abstract notifyOfCompletedCourse(courseId :string, semester:number) : boolean

  public abstract notifyOfCompletedChild(prereqId :string, semester:number) : boolean

  protected abstract updateSemesterCompleted(semester: number) :void
}


export class AndPrerequisiteNode extends PrerequisiteNode{

  public isCompleted() {
    return this.completedChildPrereqs.size + this.completedCourses.size == this.completedCourses.size + this.outgoingCourses.length
  }

  public notifyOfCompletedCourse(courseId :string, semester :number){
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

  protected updateSemesterCompleted(semester: number): void {
    if(this.semesterCompleted == null){
      this.semesterCompleted = semester
    }
    else {
      this.semesterCompleted = Math.min(semester)
    }
  }

}
