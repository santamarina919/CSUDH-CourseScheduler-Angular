import {inject, Injectable} from '@angular/core';
import {DegreeService} from '../service/degree.service';
import {Requirement} from './Requirement';
import {Prerequisite} from './Prerequisite';
import {Course} from './Course';
import {CourseNode} from './CourseNode';
import {PrerequisiteNode} from './PrerequisiteNode';
import {RequirementNode} from './RequirementNode';


export class CourseDegreeGraph {
  private requirementNodeById = new Map<string,RequirementNode>();

  private prerequisiteNodeById = new Map<string,PrerequisiteNode>();

  private courseNodeById = new Map<string,CourseNode>();

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
    this.initState()
  }



  private initState() {

    const plannedCourses = Array.from(this._courses.values()).filter(course => course.semesterPlanned != null).sort((a, b) => a.semesterPlanned! - b.semesterPlanned!)
    plannedCourses.forEach(course => {
      const semesterAvailable = this.determineAvailability(this.courseNodeById.get(course.id)!)
      if(semesterAvailable != null){
          console.log(course.id, semesterAvailable)
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

  get courses() {
    return Array.from(this._courses.values());
  }



  get availableCourses() {
    return Array.from(this._courses.values())
      .filter(course => course.semesterAvailable != null)
  }

  fetchCourse(courseId :string){
    return this._courses.get(courseId) ?? null
  }

  get roots() {
    return this.rootRequirements
  }

  fetchRequirementBy(requirementId :string){
    return this.requirements.get(requirementId)!
  }

  get courseMap() {
    return this._courses;
  }

  get requirementMap() {
    return this.requirements;
  }

  get prerequisiteMap() {
    return this.prerequisites;
  }



}


