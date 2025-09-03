import {Requirement} from './Requirement';
import {Prerequisite, PrerequisiteType} from './Prerequisite';
import {Course} from './Course';
import {CourseNode} from './CourseNode';
import {PrerequisiteNode} from './PrerequisiteNode';
import {RequirementNode} from './RequirementNode';
import {ScheduleEffect} from './effects/ScheduleEffect';
import {CourseAddBuilder} from './effects/CourseAdd';
import {SerializedGraph} from './SerializedGraph';


export class CourseDegreeGraph {
  private requirementNodeById = new Map<string,RequirementNode>();

  private prerequisiteNodeById = new Map<string,PrerequisiteNode>();

  private courseNodeById = new Map<string,CourseNode>();

  //Returns the earliest semester a prerequisite had all its prerequisites completed or null if it has not been completed
  private earliestSemesterSatisfied :Map<string,number | undefined>;

  constructor(
    private _courses: Map<string,Course>,
    private prerequisites: Map<string,Prerequisite>,
    private requirements: Map<string,Requirement>,
    private courseNodes: Map<string,CourseNode>,
    private prereqNodes :Map<string,PrerequisiteNode>,
    private reqNodes :Map<string,RequirementNode>,
    private rootRequirements :string[]
  ){
    this.reqNodes.forEach(requirement => {
      this.requirementNodeById.set(requirement.requirementId,requirement)
    })

    this.prereqNodes.forEach(node => {
      this.prerequisiteNodeById.set(node.prerequisiteId,node)
    })

    this.courseNodes.forEach(node => {
      this.courseNodeById.set(node.courseId,node)
    })
    this.earliestSemesterSatisfied = new Map<string,number | undefined>()
    this.setNoPrereqCoursesAvailable()
    this.initState()
  }

  private setNoPrereqCoursesAvailable() {
    Array.from(this.courseNodes.values()).forEach(courseNode => {
      if(courseNode.rootPrereq == null) {
        this._courses.get(courseNode.courseId)!.semesterAvailable = 0
      }
    })
  }

  private initState() {

    const plannedCourses = Array.from(this._courses.values()).filter(course => course.semesterPlanned != null).sort((a, b) => a.semesterPlanned! - b.semesterPlanned!)
    plannedCourses.forEach(course => {
      const semesterAvailable = this.determineAvailability(this.courseNodeById.get(course.id)!)
      if(semesterAvailable != null){
          course.semesterAvailable = semesterAvailable
      }
      else {
        console.log(course.id, 'null')
      }
    })

  }


  private determineAvailability(rootNode: CourseNode) :number | null {
    if(rootNode.rootPrereq == null){
      return 0
    }

    const rootPrereq = this.prerequisiteNodeById.get(rootNode.rootPrereq)!
    let semesterAvailable :number | null = null
    if(rootPrereq.type == 'AND'){
      semesterAvailable = this.determineAndPrerequisiteCompleteness(rootPrereq)
    }
    else if(rootPrereq.type == 'OR'){
      semesterAvailable =  this.determineOrPrerequisiteCompleteness(rootPrereq)
    }
    return semesterAvailable != null ? semesterAvailable + 1 : null;
  }

  private determineOrPrerequisiteCompleteness(rootPrereq: PrerequisiteNode) :number | null {
    let earliestSemesterCompleted :number | null = null
    rootPrereq.outgoingCourses.forEach(course => {
        const courseDetails = this._courses.get(course)!
        if(courseDetails.semesterPlanned != null){
          if(earliestSemesterCompleted == null){
            earliestSemesterCompleted = courseDetails.semesterPlanned!
          }
          else {
            earliestSemesterCompleted = Math.min(earliestSemesterCompleted, courseDetails.semesterPlanned!)
          }
        }
    })

    let earliestReqCompleted :number | null = null

    rootPrereq.outgoingPrereqs.forEach(prereq => {
      const prereqDetails = this.prerequisiteNodeById.get(prereq)!
      if(prereqDetails.type == 'AND'){
        earliestReqCompleted = this.determineAndPrerequisiteCompleteness(prereqDetails)
      }
      else if(prereqDetails.type == 'OR'){
        earliestReqCompleted = this.determineOrPrerequisiteCompleteness(prereqDetails)
      }
    })

    if(earliestSemesterCompleted != null && earliestReqCompleted != null){
      return Math.min(earliestSemesterCompleted, earliestReqCompleted)
    }
    else if(earliestSemesterCompleted != null){
      return earliestSemesterCompleted
    }
    else {
      return earliestReqCompleted
    }
  }


  private determineAndPrerequisiteCompleteness(rootPrereq: PrerequisiteNode):number | null {
    let incompletePrereq = false
    let latestPrereqCompleted :number = Number.MIN_SAFE_INTEGER
    rootPrereq.outgoingCourses.forEach(course => {
      const courseDetails = this._courses.get(course)!
      if(courseDetails.semesterPlanned == null){
        incompletePrereq = true
        return
      }
      latestPrereqCompleted = Math.max(latestPrereqCompleted, courseDetails.semesterPlanned!)
    })

    if(incompletePrereq){
      return null
    }

    let latestReqCompleted :number = Number.MIN_SAFE_INTEGER

    rootPrereq.outgoingPrereqs.forEach(prereq => {
      const prereqDetails = this.prerequisiteNodeById.get(prereq)!
      if(prereqDetails.type == 'AND'){
        const semesterCompleted = this.determineAndPrerequisiteCompleteness(prereqDetails)
        if(semesterCompleted == null){
          incompletePrereq = true
          return
        }
        latestReqCompleted = Math.max(latestReqCompleted, semesterCompleted)
      }
    })

    if(incompletePrereq){
      return null
    }
    return Math.max(latestPrereqCompleted, latestReqCompleted)
  }

  courses() {
    return Array.from(this._courses.values());
  }



  availableCourses(semesterNum :number) {
    const avail =  Array.from(this._courses.values())
      .filter(course => course.semesterAvailable != null && course.semesterAvailable! < semesterNum && course.semesterPlanned == null)
    return avail
  }

  fetchCourse(courseId :string){
    return this._courses.get(courseId) ?? null
  }

  roots() {
    return this.rootRequirements
  }

  fetchRequirementBy(requirementId :string){
    return this.requirements.get(requirementId)!
  }

  courseMap() {
    return this._courses;
  }

  requirementMap() {
    return this.requirements;
  }

 prerequisiteMap() {
    return this.prerequisites;
  }

  groupCoursesBySemeter() {
    const semesterMap = new Map<number,string[]>()
    this.courses().forEach(course => {
      if(course.semesterPlanned != null){
        if(!semesterMap.has(course.semesterPlanned!)){
          semesterMap.set(course.semesterPlanned!,[])
        }

        semesterMap.get(course.semesterPlanned)!.push(course.id)
      }
    })

    return semesterMap
  }

  findAllDependentCourses(courseId :string,
                          onPrereqNode :(prereq :PrerequisiteNode) => void = () => {},
                          onRootPrerequisite :(prereq :PrerequisiteNode) => void = () => {})
    :string[] {
    let allDependentCourses :string[] = []
    const courseNode = this.courseNodeById.get(courseId)!

    courseNode.incomingPreqreqs.forEach(prereqId => {
      const dependentCourseFromThisNode = this.findRootCourse(this.prerequisiteNodeById.get(prereqId)!, [],onPrereqNode,onRootPrerequisite)
      allDependentCourses = [...allDependentCourses,...dependentCourseFromThisNode]
    })

    return allDependentCourses
  }

  private findRootCourse(prereq: PrerequisiteNode, courses :string[],onPrereqNode :(prereq :PrerequisiteNode) => void, onRootPrereq : (prereq :PrerequisiteNode) => void ) {
    onPrereqNode(prereq)
    prereq.incomingPrereqs.forEach(prereqId => {
        this.findRootCourse(this.prerequisiteNodeById.get(prereqId)!,courses,onPrereqNode,onRootPrereq)
    })
    if(prereq.parentCourse != null){
      onRootPrereq(prereq)
      courses.push(prereq.parentCourse!)
    }
    return courses
  }


  addCourseToSchedule(course: Course, semester :number) {
    if(course.semesterAvailable == null){
      throw new Error('Course must have semester available something when wrong in our logic')
    }
    if(course.semesterAvailable >= semester){
      throw new Error('Course must have semester available less than or equal to semester when wrong in our logic')
    }

    course.semesterPlanned = semester

    //TODO: persist the planned semester

    const effect =  this.computeAllDependentPrerequisiteAvailability(course,semester, new CourseAddBuilder().for(course.id))
    return effect

  }

  private computeAllDependentPrerequisiteAvailability(addedCourse: Course, semesterPlanned: number,addEffect :CourseAddBuilder) :CourseAddBuilder {
    const courseNode = this.courseNodeById.get(addedCourse.id)!

    console.log("prerequisites that depend on this course -> ",courseNode.incomingPreqreqs)
    for(const dependentNodeId of courseNode.incomingPreqreqs){
      const node = this.prerequisiteNodeById.get(dependentNodeId)!

      const semesterAvail = this.earliestSemesterSatisfied.get(dependentNodeId)

      if(semesterAvail != null && node.type == 'OR' &&  semesterPlanned < semesterAvail ){
        this.earliestSemesterSatisfied.set(dependentNodeId, semesterPlanned)
        addEffect.statisfiesPrerequisite(dependentNodeId)
        return addEffect
      }

      //This line and compute avail for parent nodes may be the source of bugs regarding course availability
      const semesterCompleted = this.computePrerequisiteAvailabilityForParentNodes(node,addEffect)
      if(semesterCompleted != null){
        this.earliestSemesterSatisfied.set(dependentNodeId, semesterCompleted)
      }



    }

    return addEffect
  }


  private computePrerequisiteAvailabilityForParentNodes(node :PrerequisiteNode, effect :CourseAddBuilder) :number | null {
    const prereqFunction = this.completionFunction(node.type)

    const semesterCompleted = prereqFunction(node)

    if(semesterCompleted != null){
      if(node.parentCourse != null){
         this.updateCourseAvailability(node.parentCourse, semesterCompleted)
         effect.freesCourse(node.parentCourse,semesterCompleted)
      }
      else {
        node.incomingPrereqs.forEach(prereqId => {

          const parentNode = this.prerequisiteNodeById.get(prereqId)!
          this.computePrerequisiteAvailabilityForParentNodes(parentNode,effect)
        })
      }
    }

    return semesterCompleted
  }



  private isValidOrPrereqNode = (prereqNode: PrerequisiteNode) :number | null => {
    let earliestSemesterCompleted: number | null = null;

    prereqNode.outgoingCourses.forEach(childCourse => {
      const childCourseDetails = this._courses.get(childCourse)!
      if(childCourseDetails.semesterPlanned != null){
        earliestSemesterCompleted = Math.min(earliestSemesterCompleted ?? Number.MAX_SAFE_INTEGER, childCourseDetails.semesterPlanned!)
      }
    })

    for(const prereqId  of prereqNode.outgoingPrereqs){

      const semesterAvail = this.earliestSemesterSatisfied.get(prereqId)

      if(semesterAvail != null){
        return semesterAvail
      }

      const prereqNode = this.prerequisiteNodeById.get(prereqId)!

      const prereqFunction = this.completionFunction(prereqNode.type)

      const prereqChildCompleted = prereqFunction(prereqNode)

      if(prereqChildCompleted != null){
        earliestSemesterCompleted = Math.min(earliestSemesterCompleted ?? Number.MAX_SAFE_INTEGER, prereqChildCompleted)
      }
    }

    if(earliestSemesterCompleted != null) this.earliestSemesterSatisfied.set(prereqNode.prerequisiteId,earliestSemesterCompleted)
    return earliestSemesterCompleted
  }

  private isValidAndPrereqNode = (prereqNode: PrerequisiteNode) :number | null => {
    const semesterAvail = this.earliestSemesterSatisfied.get(prereqNode.prerequisiteId)
    if(semesterAvail != undefined){
      return semesterAvail
    }

    var latestSemesterCompleted = -1

    const uncompletedClassExists = prereqNode.outgoingCourses.find(childCourse => {
      latestSemesterCompleted = Math.max(latestSemesterCompleted, this._courses.get(childCourse)!.semesterPlanned ?? -1)
      return this._courses.get(childCourse)!.semesterPlanned == null
    }) != undefined

    if(uncompletedClassExists){
      return null
    }

    const uncompletedChildNodeExists = prereqNode.outgoingPrereqs.find(prereqId => {

      const childPrereqNode = this.prerequisiteNodeById.get(prereqId)!

      const prereqFunction = this.completionFunction(childPrereqNode.type)

      const semesterCompleted = prereqFunction(childPrereqNode)


      if(semesterCompleted == null){
        return true //Found child node that is uncompleted
      }
      else {
        latestSemesterCompleted = Math.max(latestSemesterCompleted, semesterCompleted)
        return false
      }

    }) != undefined

    if(uncompletedChildNodeExists){
      return null
    }

    this.earliestSemesterSatisfied.set(prereqNode.prerequisiteId,latestSemesterCompleted)
    return latestSemesterCompleted
  }

  //TODO this causes error must "this" is undefined lost when i returned reference.
  private completionFunction (type :PrerequisiteType)  :(prereqNode: PrerequisiteNode) => number | null  {
    if(type == 'AND'){
     return this.isValidAndPrereqNode
    }
    else if(type == 'OR'){
      return this.isValidOrPrereqNode
    }
    else {
      throw new Error('Unknown prerequisite type')
    }
  }

  private updateCourseAvailability(courseId :string, semester :number) {
    const course = this._courses.get(courseId)!
    if(course == null){
      throw new Error('Course does not exist')
    }
    course.semesterAvailable = semester
  }

  isPrereqCompelted(prereqId: string) {
    return this.earliestSemesterSatisfied.get(prereqId) != null
  }


  //Serilized so it could be displayed in html
  public serilizedGraph() {

    const fetchRootPrereq = (courseId :string) => {
      const prereqId = this.courseNodeById.get(courseId)!.rootPrereq
      if(prereqId == null){
        return null
      }
      return this.prerequisites.get(prereqId)!
    }

    return new SerializedGraph(this.rootRequirements.map(id => this.requirements.get(id)!),this.requirements,this._courses,this.prerequisites,this.earliestSemesterSatisfied,fetchRootPrereq)
  }


}


