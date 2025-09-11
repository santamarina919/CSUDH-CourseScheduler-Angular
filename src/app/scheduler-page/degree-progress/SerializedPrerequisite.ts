import {Prerequisite, PrerequisiteType} from "../data-models/Prerequisite";

export class SerializedPrerequisite {
  public id: string
  public type: PrerequisiteType
  public leafCourses: string[]
  public childPrereqs: SerializedPrerequisite[]
  public semesterCompleted :number | null

  constructor(prereq: Prerequisite, prereqMap: Map<string, Prerequisite>, fetchSemesterPrereqCompleted: (prereqId: string) => (number | null), semesterCompleted: number | null) {
    this.id = prereq.prereqId
    this.type = prereq.type
    this.leafCourses = prereq.leafCourses
    this.childPrereqs = []
    this.semesterCompleted = semesterCompleted
    prereq.childrenPrereqs.forEach(child => {
      const semesterChildCompleted = fetchSemesterPrereqCompleted(child)
      this.childPrereqs.push(new SerializedPrerequisite(prereqMap.get(child)!, prereqMap, fetchSemesterPrereqCompleted, semesterChildCompleted))
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
