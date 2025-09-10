import {Prerequisite, PrerequisiteType} from "../data-models/Prerequisite";

export class SerializedPrerequisite {
  public id: string
  public type: PrerequisiteType
  public leafCourses: string[]
  public childPrereqs: SerializedPrerequisite[]

  constructor(prereq: Prerequisite, prereqMap: Map<string, Prerequisite>) {
    this.id = prereq.prereqId
    this.type = prereq.type
    this.leafCourses = prereq.leafCourses
    this.childPrereqs = []
    prereq.childrenPrereqs.forEach(child => {
      this.childPrereqs.push(new SerializedPrerequisite(prereqMap.get(child)!, prereqMap))
    })
  }

  description() {
    if (this.type == "AND") {
      return "Complete all prerequisites and courses listed in next panel"
    } else {
      return "Complete one of the prerequisites or courses listed in next panel"
    }
  }

}
