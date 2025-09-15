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
  public effects :ScheduleEffect[] = []

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
   * @param course
   * @param semester
   */
  public addCourseToSchedule(course :Course,semester :number) {
  this.courseDegreeGraph.addCourseToSchedule(course.id,semester)
    this.planService.addCourseToPlan(course.id,semester,this.planDetails.id)
      .subscribe(response => {})
  }

  public previewCourseRemoval(courseId :string){
    return this.courseDegreeGraph.removeCourseFromSchedule(courseId,false)
  }

  public removeCourse(courseId :string){
    const removedCourses = this.courseDegreeGraph.removeCourseFromSchedule(courseId,true)
    removedCourses.forEach(courseId => {
      this.planService.removeCourse(courseId,true,this.planDetails.id).subscribe(response => {})
    })
  }

  /**
   * Retrieves the course with the id that was passed in. Assumes that the id is valid
   * @param id
   */
  public courseWith(id :string){
    return this.courseMap.get(id)!
  }

  public available(semester :number) {
    return this.courseDegreeGraph.courseStates()
      .filter(state => state.semesterPlanned == null && state.semesterAvailable != null && semester >= state.semesterAvailable)
  }

  public planned(){
    return this.courseDegreeGraph.courseStates()
      .filter(state => state.semesterPlanned != null)
  }

  //################### END OF MODIFYING FUNCTIONS ########################
}
