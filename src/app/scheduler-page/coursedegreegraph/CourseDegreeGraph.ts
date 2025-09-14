import {Requirement} from '../data-models/Requirement';
import {Prerequisite, PrerequisiteType} from '../data-models/Prerequisite';
import {Course} from '../data-models/Course';
import {CourseNode} from './CourseNode';
import {PrerequisiteNode} from './PrerequisiteNode';
import {RequirementNode} from './RequirementNode';
import {ScheduleEffect} from '../effects/ScheduleEffect';
import {CourseAddBuilder} from '../effects/CourseAdd';
import {SerializedGraph} from '../degree-progress/SerializedGraph';


export class CourseDegreeGraph {

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
      const semesterAvailable = this.determineAvailability(this.courseNodes.get(course.id)!)
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

    const rootPrereq = this.prereqNodes.get(rootNode.rootPrereq)!
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
      const prereqDetails = this.prereqNodes.get(prereq)!
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
      const prereqDetails = this.prereqNodes.get(prereq)!
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
    const courseNode = this.courseNodes.get(courseId)!

    courseNode.incomingPreqreqs.forEach(prereqId => {
      const dependentCourseFromThisNode = this.findRootCourse(this.prereqNodes.get(prereqId)!, [],onPrereqNode,onRootPrerequisite)
      allDependentCourses = [...allDependentCourses,...dependentCourseFromThisNode]
    })

    return allDependentCourses
  }

  private findRootCourse(prereq: PrerequisiteNode, courses :string[],onPrereqNode :(prereq :PrerequisiteNode) => void, onRootPrereq : (prereq :PrerequisiteNode) => void ) {
    onPrereqNode(prereq)
    prereq.incomingPrereqs.forEach(prereqId => {
        this.findRootCourse(this.prereqNodes.get(prereqId)!,courses,onPrereqNode,onRootPrereq)
    })
    if(prereq.parentCourse != null){
      onRootPrereq(prereq)
      courses.push(prereq.parentCourse!)
    }
    return courses
  }


  /**
   * Mark a node as being planned for some semester. Call to this function will traverse graph starting at the node
   * with the specified course id. It will mark neighboring course nodes as available if all prerequisites are fullfilled
   * @param courseId the id of the course being added
   * @param semester the semester it will be added to
   */
  public addCourseToSchedule(courseId :string, semester :number) {
    const node = this.courseNodes.get(courseId)!
    if(node.semesterAvailable == null){
      throw new Error('Course must have semester available something when wrong in our logic')
    }
    if(node.semesterAvailable >= semester){
      throw new Error('Course must have semester available less than or equal to semester when wrong in our logic')
    }

    node.semesterPlanned = semester

    this.courseCompletionTraversal(courseId,semester)

  }

  private courseCompletionTraversal(courseId :string, semesterCompleted :number){
    const courseNode = this.courseNodes.get(courseId)!
    courseNode.incomingPreqreqs.forEach(prereqId => {
      const prereqNode = this.prereqNodes.get(prereqId)!
      const isCompleted = prereqNode.notifyOfCompletedCourse(courseId,semesterCompleted)
      if(isCompleted){
        this.prereqTraversal(prereqNode,semesterCompleted)
      }
    })
  }

  private prereqTraversal(completedPrereq :PrerequisiteNode, semesterCompleted :number){
    if(completedPrereq.parentCourse != null){
      this.courseNodes.get(completedPrereq.parentCourse)!.semesterAvailable = semesterCompleted + 1
    }
    else{
      completedPrereq.incomingPrereqs.forEach(prereqId => {
        const prereqNode = this.prereqNodes.get(prereqId)!
        const isCompleted = prereqNode.notifyOfCompletedChild(prereqId,semesterCompleted)
        if(isCompleted){
          this.prereqTraversal(prereqNode,semesterCompleted)
        }
      })
    }

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

      const prereqNode = this.prereqNodes.get(prereqId)!

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

      const childPrereqNode = this.prereqNodes.get(prereqId)!

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

  isPrereqCompleted(prereqId: string) {
    return this.earliestSemesterSatisfied.get(prereqId) != null
  }


  public serializedGraph() {

    const fetchRootPrereq = (courseId :string) => {
      const prereqId = this.courseNodes.get(courseId)!.rootPrereq
      if(prereqId == null){
        return null
      }
      return this.prerequisites.get(prereqId)!
    }

    return new SerializedGraph(
      this.rootRequirements.map(id => this.requirements.get(id)!),
      this.requirements,
      this._courses,
      this.prerequisites,
      this.earliestSemesterSatisfied,
      fetchRootPrereq,
      this.semesterCourseCompleted,
      this.semesterCourseAvailable,
      this.semesterPrereqCompleted
      )
  }

  public semesterCourseCompleted = (courseId :string) =>{
    return this._courses.get(courseId)!.semesterPlanned
  }

  public semesterCourseAvailable = (courseId :string) => {
    return this._courses.get(courseId)!.semesterPlanned
  }

  public semesterPrereqCompleted = (prereqId :string) => {
    return this.earliestSemesterSatisfied.get(prereqId) ?? null
  }
}


