import {Requirement, RequirementType} from './Requirement';
import {Course} from './Course';
import {Prerequisite, PrerequisiteType} from './Prerequisite';


export class SerializedRequirement {

  public id : string;
  public name : string;
  public type : RequirementType;
  public leafCourses :SerializedCourse[]
  public childRequirements : SerializedRequirement[]

  constructor(requirement: Requirement, requirementMap: Map<string, Requirement>, courseMap: Map<string, Course>, fetchRootPrereq: (courseId: string) => (Prerequisite | null), prereqMap :Map<string,Prerequisite>) {
    this.id = requirement.requirementId
    this.name = requirement.name ?? "Unnamed Requirement"
    this.type = requirement.type
    this.childRequirements = []
    requirement.childRequirements.forEach(child => {
      this.childRequirements.push(new SerializedRequirement(requirementMap.get(child)!, requirementMap, courseMap, fetchRootPrereq,prereqMap))
    })

    this.leafCourses = []

    requirement.leafCourses.forEach(course => {
      this.leafCourses.push(new SerializedCourse(courseMap.get(course)!,fetchRootPrereq(course),prereqMap))
    })
  }

  description() :string {
    return this.type == "AND" ? "Complete All Requirements listed in next panel" : "Complete one of the requirements listed in next panel"
  }

}

export class SerializedCourse {
  public id : string;
  public name :string;
  public units :number
  public rootPrereq : SerializedPrerequisite | null

  constructor(course :Course, rootPrereq :Prerequisite | null,prereqMap :Map<string,Prerequisite>) {
    this.id = course.id
    this.name = course.name
    this.units = course.units
    this.rootPrereq = rootPrereq != null ? new SerializedPrerequisite(rootPrereq,prereqMap) : null
  }
}

export class SerializedPrerequisite {
  public id :string
  public type :PrerequisiteType
  public leafCourses :string[]
  public childPrereqs : SerializedPrerequisite[]

  constructor(prereq :Prerequisite, prereqMap :Map<string,Prerequisite>) {
    this.id = prereq.prereqId
    this.type = prereq.type
    this.leafCourses = prereq.leafCourses
    this.childPrereqs = []
    prereq.childrenPrereqs.forEach(child => {
      this.childPrereqs.push(new SerializedPrerequisite(prereqMap.get(child)!, prereqMap))
    })
  }

  description() {
    if(this.type == "AND") {
      return "Complete all prerequisites and courses listed in next panel"
    }
    else {
      return "Complete one of the prerequisites or courses listed in next panel"
    }
  }

}

export class SerializedGraph {

  requirements :SerializedRequirement[] = []

  constructor(
    public rootRequirements :Requirement[],
    private requirementMap : Map<string, Requirement>,
    private courseMap : Map<string, Course>,
    private prereqMap : Map<string, Prerequisite>,
    private completedRequirements :Map<string,number | undefined>,
    private fetchRootPrereq :(courseId :string) => Prerequisite | null,
  ) {
    this.rootRequirements.forEach(requirement => {
      this.requirements.push(new SerializedRequirement(requirement, requirementMap, courseMap,fetchRootPrereq,prereqMap))
    })
  }






}
