import {Requirement} from '../data-models/Requirement';
import {Prerequisite, PrerequisiteType} from '../data-models/Prerequisite';
import {Course} from '../data-models/Course';
import {CourseNode} from './CourseNode';
import {PrerequisiteNode} from './PrerequisiteNode';
import {RequirementNode} from './RequirementNode';
import {CourseState} from './CourseState';
import {PrereqState} from './PrereqState';
import {ListenerOptions} from '@angular/core';


export class CourseDegreeGraph {


  constructor(
    private courseNodes: Map<string,CourseNode>,
    private prereqNodes :Map<string,PrerequisiteNode>,
    private reqNodes :Map<string,RequirementNode>,
  ){
    this.setNoPrereqCoursesAvailable()
    this.initState()
  }

  private setNoPrereqCoursesAvailable() {
    Array.from(this.courseNodes.values()).forEach(courseNode => {
      if(courseNode.rootPrereq == null) {
        courseNode.semesterAvailable = 0
      }
    })
  }

  private initState() {
    const courseList = Array.from(this.courseNodes.values())
      .filter(course => course.semesterPlanned != null)
      .sort((a,b) => a.semesterPlanned! - b.semesterPlanned!)

    courseList.forEach(courseState => {
      this.addCourseToSchedule(courseState.courseId,courseState.semesterPlanned!)
    })

  }

  //TODO for add and removal add boolean parameter to indicate if change takes effect. Also create
  //TODO effect interface. Where each method can push effect objets into it
  //############### EXPOSED METHODS FOR STATE OBJECT TO USE ###############################

  /**
   * Returns the state of each course node in the graph.
   * In particular tells if a course is available and if it has been planned
   */
  public courseStates() {
    return Array.from(this.courseNodes.values())
      .map(node => new CourseState(node.courseId,node.semesterAvailable,node.semesterPlanned))
  }

  /**
   * Return state of all prereq nodes.
   * Right now will only return if it is completed and what semester
   */
  public prereqStates() {
    return Array.from(this.prereqNodes.values())
      .map(node => new PrereqState(node.prerequisiteId,node.semesterCompleted))
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
    if(node.semesterAvailable > semester){
      throw new Error('Course must have semester available less than or equal to semester when wrong in our logic')
    }

    node.semesterPlanned = semester

    this.courseCompletionTraversal(courseId,semester)

  }


  /**
   * Removes a course from the schedule and removed any courses that will need to be removed as a result of the current removal
   * @param courseId
   * @param removeApproved indicate  weather this removal will actually be persisted
   * @param affectedCourses
   */
  public removeCourseFromSchedule(courseId :string, removeApproved :boolean,affectedCourses :string[]) :string[]{
    affectedCourses.push(courseId)
    const courseNode = this.courseNodes.get(courseId)!
    if(courseNode.semesterPlanned == null){
      throw Error("Cannot remove a course that has not been planned. Faulty logic caught in remove course graph method")
    }

    if(removeApproved){
      courseNode.semesterPlanned = null
      //the courseNode is now only available
    }

    courseNode.incomingPreqreqs.forEach(prereqId => {
      const prereqNode = this.prereqNodes.get(prereqId)!
      this.prereqCourseRemovalTraversal(prereqNode,removeApproved,affectedCourses)
      if(removeApproved){
        prereqNode.notifyOfRemovedCourse(courseId)
      }

    })
    return affectedCourses
  }

  //######## END OF EXPOSED METHODS #################################################

  private courseCompletionTraversal(courseId :string, semesterCompleted :number){
    const courseNode = this.courseNodes.get(courseId)!
    courseNode.incomingPreqreqs.forEach(prereqId => {
      const prereqNode = this.prereqNodes.get(prereqId)!
      const isCompleted = prereqNode.notifyOfCompletedCourse(courseId,semesterCompleted)
      if(isCompleted){
        this.prereqCourseCompletionTraversal(prereqNode,semesterCompleted)
      }
    })
  }

  private prereqCourseCompletionTraversal(completedPrereq :PrerequisiteNode, semesterCompleted :number){
    if(completedPrereq.parentCourse != null ){
      this.courseNodes.get(completedPrereq.parentCourse)!.semesterAvailable = semesterCompleted + 1
    }
    else{
      completedPrereq.incomingPrereqs.forEach(prereqId => {
        const prereqNode = this.prereqNodes.get(prereqId)!
        const isCompleted = prereqNode.notifyOfCompletedChild(prereqId,semesterCompleted)
        if(isCompleted){
          this.prereqCourseCompletionTraversal(prereqNode,semesterCompleted)
        }
      })
    }

  }

  private prereqCourseRemovalTraversal(prereq: PrerequisiteNode, removeApproved: boolean, affectedCourses: string[]){
    const wasCompleted = prereq.isCompleted()
    if(wasCompleted == false){
      return
    }

    prereq.semesterCompleted = null

    if(prereq.parentCourse != null){
      const courseNode = this.courseNodes.get(prereq.parentCourse)!
      if(courseNode.semesterPlanned != null) {
        this.removeCourseFromSchedule(courseNode.courseId, removeApproved, affectedCourses)
      }
      if(removeApproved){
        courseNode.semesterPlanned = null
        courseNode.semesterAvailable = null
      }
    }
    else {
      prereq.incomingPrereqs.forEach(parentId => {
        const parentPrereqNode = this.prereqNodes.get(parentId)!
        if(removeApproved){
          parentPrereqNode.notifyOfRemovedPrereq(prereq.prerequisiteId)
        }
        this.prereqCourseRemovalTraversal(parentPrereqNode, removeApproved, affectedCourses)
      })
    }

  }

}


