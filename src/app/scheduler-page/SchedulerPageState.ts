import {CourseDegreeGraphBuilder} from './CourseDegreeGraphBuilder';
import {PlanService} from '../service/plan.service';
import {DegreeService} from '../service/degree.service';
import {forkJoin} from 'rxjs';
import {CourseDegreeGraph} from './CourseDegreeGraph';
import {FullPlanDetails, notTerm, Term} from './FullPlanDetails';
import {Requirement} from './Requirement';
import {Prerequisite} from './Prerequisite';
import {Course} from './Course';
import {PlannedCourse} from './PlannedCourse';
import {Semester} from './Semester';

export class Effect {
  constructor(public id :string) {
  }

}

export class SchedulerPageState {
  private planDetails :FullPlanDetails = new FullPlanDetails("Your Plan ID","Loading Plan Details","Fall", 2019,"CSC")

  private courseDegreeGraph :CourseDegreeGraph | null = null

  private _effects :Effect[] = []

  constructor(
    private planId :string,
    private degreeId :string,
    private planService:PlanService,
    private degreeService :DegreeService,
  ) {
    this.planService.planDetails(this.planId).subscribe(response => {
      response.term = (response.term as unknown as string )== "FALL" ? "Fall" : "Spring"
      this.planDetails = response
    })

    const coursesObservable$ = this.degreeService.fetchCourses(this.degreeId)

    const requirementObservable$ = this.degreeService.fetchRequirements(this.degreeId)

    const prerequisiteObservable$ = this.degreeService.fetchPrerequisites(this.degreeId)

    const plannedObservable$ = this.planService.plannedCourses(this.planId)

    const roots$ = this.degreeService.fetchRootsOfDegree(this.degreeId)

    const jobs  = [coursesObservable$, requirementObservable$, prerequisiteObservable$, plannedObservable$,roots$]

    const JOB_INDEXES = {
      COURSES : 0,
      REQUIREMENTS :1,
      PREREQUISITES : 2,
      PLANNED : 3,
      ROOTS : 4
    }

    forkJoin(jobs).subscribe(finishedJobs => {
      const courses = finishedJobs[JOB_INDEXES.COURSES] as Course[]
      const requirements = finishedJobs[JOB_INDEXES.REQUIREMENTS] as Requirement[]
      const prerequisites = finishedJobs[JOB_INDEXES.PREREQUISITES] as Prerequisite[]
      const planned = finishedJobs[JOB_INDEXES.PLANNED] as PlannedCourse[]
      const roots = finishedJobs[JOB_INDEXES.ROOTS] as string[]

      this.courseDegreeGraph = new CourseDegreeGraphBuilder(courses,requirements,prerequisites,planned,roots).outputGraph
    })


  }

  get availableCourses() {
    return this.courseDegreeGraph?.availableCourses ?? null
  }

  fetchCourse(courseId :string){
    return this.courseDegreeGraph?.fetchCourse(courseId)
  }

  //********FUNCTIONS RELATED TO PLANNED SEMESTERS********
  _maxSemester:number | null = null

  DEFAULT_MAX = 2 * 4

  get maxSemester() {
    if(this._maxSemester != null){
      return this._maxSemester
    }

    const courseList = this.courseDegreeGraph?.courses ?? []
    if(courseList.length == 0){
      return this.DEFAULT_MAX
    }

    const maxSemester = courseList.reduce((acc, course) => {
        return Math.max(acc, course.semesterAvailable ?? 0)
      }, 0)

    this._maxSemester =  maxSemester < this.DEFAULT_MAX ? this.DEFAULT_MAX : maxSemester
    return this._maxSemester
  }

  set maxSemester(semester :number){
    if(semester < 1){
      throw new Error('Semester must be greater than 0')
    }
    this._maxSemester = semester
  }

  get semesters() :Semester[] | null {
    if(this.courseDegreeGraph == null){
      return null
    }

    let largestSemester = this.maxSemester

    const semesterMap = new Map<number,Semester>()
    this.courseDegreeGraph.courses.forEach(course => {
      if(course.semesterPlanned != null){
        if(!semesterMap.has(course.semesterPlanned!)){
          const term = this.calcTerm(course.semesterPlanned!)
          const year = this.calcYear(course.semesterPlanned!)
          semesterMap.set(course.semesterPlanned!,new Semester(course.semesterPlanned,[],term,year))
          largestSemester = Math.max(largestSemester, course.semesterPlanned!)
        }


        semesterMap.get(course.semesterPlanned)!.courses.push(course.id)
      }
    })


    const semesters :Semester[] = []

    for(let i = 1; i <= largestSemester; i++){
      if(semesterMap.has(i)){
        semesters.push(semesterMap.get(i)!)
      }
      else {
        semesters.push(new Semester(i,[],this.calcTerm(i),this.calcYear(i)))
      }
    }

    return semesters
  }


  public calcYear(semesterNumber: number) {
    return this.planDetails.year + Math.floor(semesterNumber / 2)
  }

  public calcTerm(semesterNumber: number):Term {
    const isStartTerm = semesterNumber % 2 == 1
    if(isStartTerm){
      return this.planDetails.term
    }
    else {
      return notTerm(this.planDetails.term)
    }
  }
  //*************************************************************

  get effects(): Effect[] {
    return this._effects;
  }


  //*************Functions related to summary of an entire plan
  get roots() {
    if(this.courseDegreeGraph == null){
      return []
    }
    return this.courseDegreeGraph.roots
  }

  get rootsAsRequirements() {
    if(this.courseDegreeGraph == null){
      return []
    }

    return this.roots.map(root => this.courseDegreeGraph?.fetchRequirementBy(root)!)
  }

  get requirementMap() {
    if(this.courseDegreeGraph == null){
      return new Map<string,Requirement>()
    }
    return this.courseDegreeGraph.requirementMap
  }

  get courseMap() {
    if(this.courseDegreeGraph == null){
      return new Map<string,Course>()
    }
    return this.courseDegreeGraph.courseMap
  }


  //***********************************************************

}
