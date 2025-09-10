import {Course} from "../data-models/Course";
import {Prerequisite} from "../data-models/Prerequisite";

import {SerializedPrerequisite} from './SerializedPrerequisite';

export class SerializedCourse {
  public id: string;
  public name: string;
  public units: number
  public rootPrereq: SerializedPrerequisite | null

  constructor(course: Course, rootPrereq: Prerequisite | null, prereqMap: Map<string, Prerequisite>) {
    this.id = course.id
    this.name = course.name
    this.units = course.units
    this.rootPrereq = rootPrereq != null ? new SerializedPrerequisite(rootPrereq, prereqMap) : null
  }
}
