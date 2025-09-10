import {CourseDegreeGraph} from './CourseDegreeGraph';
import {Requirement} from '../Requirement';
import {Prerequisite} from '../Prerequisite';
import {Course} from '../Course';
import {PlannedCourse} from '../PlannedCourse';
import {CourseNode} from './CourseNode';
import {PrerequisiteNode} from './PrerequisiteNode';
import {RequirementNode} from './RequirementNode';


export class CourseDegreeGraphBuilder {

  public outputGraph :CourseDegreeGraph

  constructor(
    public courses  :Course[],

    private requirements  : Requirement[],

    private prerequisites : Prerequisite[],

    private plannedCourses : PlannedCourse[],

    private rootsOfDegree :string[]) {
    this.outputGraph = this.buildGraph()
  }

  private buildGraph() {

    this.initCourses()

    const courseNodesMap = this.createCourseNodes()

    this.findRootPrerequisiteNodes(courseNodesMap);

    const reqNodesMap = this.createRequirementNodes()

    this.extractEdgesFromRequirements(reqNodesMap, courseNodesMap);


    const prereqNodesMap = this.createPrerequisiteNodes()

    this.extractPrereqEdges(prereqNodesMap, courseNodesMap);
    const courseMap = this.associateCourseById();
    const prereqMap = this.associatePrerequisiteById();
    const reqMap = this.associateRequirementById();


    return new CourseDegreeGraph(courseMap,prereqMap,reqMap,courseNodesMap,prereqNodesMap,reqNodesMap,this.rootsOfDegree!)
  }

  private associateRequirementById() {
    const reqMap = new Map<string, Requirement>()
    this.requirements!.forEach(req => {
      reqMap.set(req.requirementId, req)
    })
    return reqMap;
  }

  private associatePrerequisiteById() {
    const prereqMap = new Map<string, Prerequisite>()
    this.prerequisites!.forEach(prereq => {
      prereqMap.set(prereq.prereqId, prereq)
    })
    return prereqMap;
  }

  private associateCourseById() {
    const courseMap = new Map<string, Course>()
    this.courses!.forEach(course => {
      courseMap.set(course.id, course)
    })
    return courseMap;
  }

  private extractPrereqEdges(prereqNodesMap: Map<string, PrerequisiteNode>, courseNodesMap: Map<string, CourseNode>) {
    Array.from(prereqNodesMap.values()).forEach(prereqNode => {
      prereqNode.outgoingPrereqs.forEach(prereq => {
        prereqNodesMap.get(prereq)!.incomingPrereqs.push(prereqNode.prerequisiteId)
      })

      prereqNode.outgoingCourses.forEach(course => {

        courseNodesMap.get(course)!.incomingPreqreqs.push(prereqNode.prerequisiteId)
      })
    })
  }

  private createPrerequisiteNodes() {
    const prereqNodes = this.prerequisites!.map(prerequisite => {

      return new PrerequisiteNode(prerequisite.prereqId, prerequisite.childrenPrereqs, prerequisite.leafCourses,[],prerequisite.type,prerequisite.parentPrereq == null ? prerequisite.parentCourse : null)
    })

    const prereqNodesMap = new Map<string, PrerequisiteNode>()
    prereqNodes.forEach(prereqNode => {
      prereqNodesMap.set(prereqNode.prerequisiteId, prereqNode)
    })

    return prereqNodesMap
  }

  private extractEdgesFromRequirements(reqNodesMap: Map<string, RequirementNode>, courseNodesMap: Map<string, CourseNode>) {
    Array.from(reqNodesMap.values()).forEach(parentReq => {
      parentReq.outgoingRequirements.forEach(childReq => {
        reqNodesMap.get(childReq)!.incomingRequirements.push(parentReq.requirementId)
      })

      parentReq.outgoingCourses.forEach(course => {
        courseNodesMap.get(course)!.incomingRequirements.push(parentReq.requirementId)
      })
    })
  }

  /**
   *
   * @param courseNodesMap
   * @private
   */
  private findRootPrerequisiteNodes(courseNodesMap: Map<string, CourseNode>) {
    this.prerequisites!.forEach(prereq => {
      if (prereq.parentPrereq == null) {
        courseNodesMap.get(prereq.parentCourse)!.rootPrereq = prereq.prereqId
      }
    })
  }

  private createRequirementNodes(){
    const reqNodes = this.requirements!.map(requirement => {
      return new RequirementNode(requirement.requirementId, requirement.childRequirements, requirement.leafCourses,[],requirement.type)
    })

    const reqNodesMap = new Map<string, RequirementNode>()
    reqNodes.forEach(reqNode => {
      reqNodesMap.set(reqNode.requirementId, reqNode)

    })
    return reqNodesMap
  }

  private createCourseNodes(){
    const courseNodes = this.courses!.map(course => {
      return new CourseNode(course.id,[],null,[])
    })

    const courseNodesMap = new Map<string, CourseNode>()
    courseNodes.forEach(courseNode => {
      courseNodesMap.set(courseNode.courseId, courseNode)
    })
    return courseNodesMap
  }

  /**
   * Api does not connect data about a certain course together. I need to do that and this function does that with plan data
   * Basically checks to see if its planned and initializes it if it has been planned. Also initialized fields to null to denote
   * that they have no value instead of leaving it as undefined
   * @param course
   * @private
   */
  private initCourses() {

    this.courses!.forEach(course => {
      course.semesterAvailable = null
      course.semesterPlanned = null

      const planData = this.plannedCourses!.find(data => data.courseId === course.id) ?? null
      if (planData != null) {
        course.semesterPlanned = planData.semester
      }
    })

  }


}
