import {Course} from "../data-models/Course";
import {Prerequisite} from "../data-models/Prerequisite";

import {SerializedPrerequisite} from './SerializedPrerequisite';

export class SerializedCourse {
  public id: string;
  public name: string;
  public units: number
  public rootPrereq: SerializedPrerequisite | null
  public semesterCompleted :number | null
  public semesterAvail :number | null

  constructor(course: Course, rootPrereq: Prerequisite | null, prereqMap: Map<string, Prerequisite>, semesterCompleted: number | null, semesterAvail: number | null, fetchSemesterPrereqCompleted: (prereqId: string) => (number | null)) {
    this.id = course.id
    this.name = course.name
    this.units = course.units
    this.semesterCompleted = semesterCompleted
    this.semesterAvail = semesterAvail
    const semesterRootCompleted = rootPrereq == null ? null :  fetchSemesterPrereqCompleted(rootPrereq!.prereqId);
    this.rootPrereq = rootPrereq != null ? new SerializedPrerequisite(rootPrereq, prereqMap,fetchSemesterPrereqCompleted, semesterRootCompleted) : null
  }
}
