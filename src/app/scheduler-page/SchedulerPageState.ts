import {CourseDegreeGraph} from './coursedegreegraph/CourseDegreeGraph';
import {FullPlanDetails} from './data-models/FullPlanDetails';
import {Course} from './data-models/Course';
import {Semester} from './data-models/Semester';
import {calcTerm} from '../utils/CalcTermFromSemester';
import {calcYear} from '../utils/CalcYearFromSemester';
import {ScheduleEffect} from './effects/ScheduleEffect';
import {PrerequisiteNode} from './coursedegreegraph/PrerequisiteNode';
import {CourseRemoveBuilder, RemovedCourse} from './effects/CourseRemove';
import {inject} from '@angular/core';
import {DegreeService} from '../service/degree.service';
import {PlanService} from '../service/plan.service';
import {SerializedGraph} from './degree-progress/SerializedGraph';


export class SchedulerPageState {
  private planService :PlanService
  private planDetails :FullPlanDetails
  public serializedGraph :SerializedGraph
  public courseDegreeGraph :CourseDegreeGraph
  public effects :ScheduleEffect[] = []

  constructor(
    courseDegreeGraph: CourseDegreeGraph,
    planDetails: FullPlanDetails,
    planService: PlanService) {
    this.courseDegreeGraph = courseDegreeGraph
    this.planDetails = planDetails
    this.planService = planService
    this.serializedGraph =  this.courseDegreeGraph.serializedGraph()
  }

  fetchCourse(courseId :string){
    return this.courseDegreeGraph.fetchCourse(courseId)
  }

  //********FUNCTIONS RELATED TO PLANNED SEMESTERS********

  private largestEmptySemester :number = 0

  private DEFAULT_MAX = 2 * 4

  setLargestEmptySemester(semester :number){
    if(semester < 1){
      throw new Error('Semester must be greater than 0')
    }
    this.largestEmptySemester = semester
  }
  semesters() :Semester[] {

    const semesterMap = this.courseDegreeGraph.groupCoursesBySemeter()

    const largestPlannedSemester = Math.max(...Array.from(semesterMap.keys()),this.DEFAULT_MAX)

    const largestSemester = Math.max(this.largestEmptySemester,largestPlannedSemester)

    const semesters :Semester[] = []

    for(let semesterNum = 1; semesterNum <= largestSemester; semesterNum++){
      if(semesterMap.has(semesterNum)){
        const semesterCourses = semesterMap.get(semesterNum)!
        semesters.push(new Semester(semesterNum,semesterCourses,calcTerm(this.planDetails.term,semesterNum),calcYear(this.planDetails.year,semesterNum)))
      }
      else {
        semesters.push(new Semester(semesterNum,[],calcTerm(this.planDetails.term,semesterNum),calcYear(this.planDetails.year,semesterNum)))
      }
    }
    return semesters
  }

  rootsAsRequirements() {
    return this.courseDegreeGraph.roots().map(root => this.courseDegreeGraph.fetchRequirementBy(root)!)
  }

  availableCourses(semester :number)  {
    return this.courseDegreeGraph.availableCourses(semester)
  }

  //***********************MODIFYING STATE FUNCTIONS************************************
  /**
   * Add a course to the users schedule. Function will first validate move with underlying graph before persisting state to
   * database
   * @param course
   * @param semester
   */
  public addCourseToSchedule(course :Course,semester :number) {
    this.courseDegreeGraph.addCourseToSchedule(course.id,semester)
    this.planService.addCourseToPlan(course.id,semester,this.planDetails.id)
      .subscribe(response => {})
  }

  removeCourseFromSchedule(courseId :string, removalEffect :CourseRemoveBuilder) {
    removalEffect.for(courseId)


    const onPrereqNode = (prereq :PrerequisiteNode) => {

      prereq.incomingPrereqs.forEach(prereqId => {
        const isCompleted = this.courseDegreeGraph.isPrereqCompleted(prereqId)
        if(isCompleted){
          removalEffect.uncompletesPrereq(prereqId)
        }
      })
    }


    const toBeRemoved = this.courseDegreeGraph.findAllDependentCourses(courseId,onPrereqNode)
    toBeRemoved.push(courseId)
    const courseToBeRemoved = toBeRemoved
      .map(courseId => this.fetchCourse(courseId)!)
      .filter(course => course.semesterPlanned != null)

    const removedCoursesEffect = courseToBeRemoved.map(course => [course.id,course.semesterPlanned!] as RemovedCourse)
    removalEffect.removes(removedCoursesEffect)


    return courseToBeRemoved
  }

  unplanCourse(courseId: string,removeApproved : boolean) {
    this.planService.removeCourse(courseId,removeApproved,this.planDetails.id)
      .subscribe(response => {})
    this.fetchCourse(courseId)!.semesterPlanned = null
  }

}
