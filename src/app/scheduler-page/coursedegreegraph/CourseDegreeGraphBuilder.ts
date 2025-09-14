import {CourseDegreeGraph} from './CourseDegreeGraph';
import {Requirement} from '../data-models/Requirement';
import {Prerequisite} from '../data-models/Prerequisite';
import {Course} from '../data-models/Course';
import {PlannedCourse} from '../data-models/PlannedCourse';
import {CourseNode} from './CourseNode';
import {AndPrerequisiteNode, OrPrerequisiteNode, PrerequisiteNode} from './PrerequisiteNode';
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

    const courseNodesMap = this.createCourseNodes()

    this.initCourses(courseNodesMap)

    this.findRootPrerequisiteNodes(courseNodesMap);

    const reqNodesMap = this.createRequirementNodes()

    this.extractEdgesFromRequirements(reqNodesMap, courseNodesMap);


    const prereqNodesMap = this.createPrerequisiteNodes()

    this.extractPrereqEdges(prereqNodesMap, courseNodesMap);


    return new CourseDegreeGraph(courseNodesMap,prereqNodesMap,reqNodesMap)
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
      if(prerequisite.type == 'AND'){
        return new AndPrerequisiteNode(prerequisite.prereqId, prerequisite.childrenPrereqs, prerequisite.leafCourses,[],prerequisite.type,prerequisite.parentPrereq == null ? prerequisite.parentCourse : null)
      }
      else{
        return new OrPrerequisiteNode(prerequisite.prereqId, prerequisite.childrenPrereqs, prerequisite.leafCourses,[],prerequisite.type,prerequisite.parentPrereq == null ? prerequisite.parentCourse : null)

      }
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
   * @private
   */
  private initCourses(courseNodesMap: Map<string, CourseNode>) {

    this.courses!.forEach(course => {
      const courseNode = courseNodesMap.get(course.id)!
      courseNode.semesterAvailable = null
      courseNode.semesterPlanned = null

      const planData = this.plannedCourses!.find(data => data.courseId === course.id) ?? null
      if (planData != null) {
        courseNode.semesterPlanned = planData.semester
      }
    })

  }


}
