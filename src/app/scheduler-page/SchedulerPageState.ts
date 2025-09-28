import {CourseDegreeGraph} from './coursedegreegraph/CourseDegreeGraph';
import {FullPlanDetails} from './data-models/FullPlanDetails';
import {Course} from './data-models/Course';
import {Semester} from './planning-container/Semester';
import {calcTerm} from '../utils/CalcTermFromSemester';
import {calcYear} from '../utils/CalcYearFromSemester';
import {PrerequisiteNode} from './coursedegreegraph/PrerequisiteNode';
import {inject} from '@angular/core';
import {DegreeService} from '../service/degree.service';
import {PlanService} from '../service/plan.service';


export class SchedulerPageState {

  private courseMap = new Map<string,Course>()

  constructor(
    private courseDegreeGraph: CourseDegreeGraph,
    private planDetails: FullPlanDetails,
    private planService: PlanService,
    private courses : Course[]
  ) {
    courses.forEach(course => {
      this.courseMap.set(course.id,course)
    })
  }

  //*********************** EXPOSED STATE FUNCTIONS**********************

  /**
   * Add a course to the users schedule. Function will first validate move with underlying graph before persisting state to
   * database
   * @param courseId
   * @param semester
   */
  public addCourseToSchedule(courseId :string,semester :number) {
    console.log("calling api with these values ", courseId,semester)
    this.courseDegreeGraph.addCourseToSchedule(courseId,semester)
    this.planService.addCourseToPlan(courseId,semester,this.planDetails.id)
      .subscribe(response => {})
    console.log("After add",this.courseDegreeGraph.courseStates())
  }

  public previewCourseRemoval(courseId :string){
    return this.courseDegreeGraph.removeCourseFromSchedule(courseId,false,[])
  }

  public removeCourse(courseId :string) {
    const removedCourses = this.courseDegreeGraph.removeCourseFromSchedule(courseId, true, [])
    console.log("calling api with these values ", removedCourses)
    removedCourses.forEach(courseId => {
      this.planService.removeCourse(courseId, true, this.planDetails.id).subscribe(response => {})
    })
    console.log("After remove", this.courseDegreeGraph.courseStates())
  }

  /**
   * Retrieves the course with the id that was passed in. Assumes that the id is valid
   * @param id
   */
  public courseWith(id :string){
    return this.courseMap.get(id)!
  }

  public courseStates(){
    return this.courseDegreeGraph.courseStates()
  }

  public available(semester :number) {
    const avail =  this.courseDegreeGraph.courseStates()
      .filter(state => state.semesterPlanned == null && state.semesterAvailable != null && semester >= state.semesterAvailable)
    return avail
  }

  public planned(){
    return this.courseDegreeGraph.courseStates()
      .filter(state => state.semesterPlanned != null)
  }

  //################### END OF EXPOSED FUNCTIONS ########################
}
