import {Requirement, RequirementType} from "../data-models/Requirement";
import {Course} from "../data-models/Course";
import {Prerequisite} from "../data-models/Prerequisite";

import {SerializedCourse} from './SerializedCourse';

export class SerializedRequirement {

  public id: string;
  public name: string;
  public type: RequirementType;
  public leafCourses: SerializedCourse[]
  public childRequirements: SerializedRequirement[]

  constructor(requirement: Requirement, requirementMap: Map<string, Requirement>, courseMap: Map<string, Course>, fetchRootPrereq: (courseId: string) => (Prerequisite | null), prereqMap: Map<string, Prerequisite>) {
    this.id = requirement.requirementId
    this.name = requirement.name ?? "Unnamed Requirement"
    this.type = requirement.type
    this.childRequirements = []
    requirement.childRequirements.forEach(child => {
      this.childRequirements.push(new SerializedRequirement(requirementMap.get(child)!, requirementMap, courseMap, fetchRootPrereq, prereqMap))
    })

    this.leafCourses = []

    requirement.leafCourses.forEach(course => {
      this.leafCourses.push(new SerializedCourse(courseMap.get(course)!, fetchRootPrereq(course), prereqMap))
    })
  }

  description(): string {
    return this.type == "AND" ? "Complete All Requirements listed in next panel" : "Complete one of the requirements listed in next panel"
  }

}
